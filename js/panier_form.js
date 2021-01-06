const urlApiGET = "http://localhost:3000/api/cameras";
const urlApiPOST = "http://localhost:3000/api/cameras/order";
var camerasArray=""; 
const camerasContainer = document.querySelector('#camera_Container');
const recapCommande = document.querySelector('#recap_commande');
const totalElement = document.getElementsByClassName("total");
const badgePanier = document.querySelector('#badge_panier');
const formulaire = document.getElementById("formulaire");
const message = document.getElementById("messageConfirmation");

class elementPanier {
    constructor(name, id, option, quantity, price){
        this.name = name;
        this.id = id;
        this.option = option;
        this.quantity = quantity;
        this.price = price;
    }
}

var elementsPanier = [];

console.log(camerasContainer);

var requete = new XMLHttpRequest;
requete.open('GET', urlApiGET);
requete.responseType = 'json'; 
requete.send(); // envoie la requete

// Dès qu'on reçoit la réponse, on execute la fonction:
requete.onload = function () { 
    if (requete.readyState === XMLHttpRequest.DONE ) { // verifie l'état de la requête. 
        if (requete.status === 200 ||requete.status === 201){
            camerasArray = requete.response; // stocke la reponse dans une variable.
            console.log(camerasArray);
            majContenuPanier(); //on appelle la fonction qui met à jour le nombre d'éléments dans le panier
            afficherBadgePanier(); // on appelle la fonction qui affiche le nombre d'éléments dans le panier
            animationInput(); //on appelle la fonction qui permet d'afficher le code couleur ok/nok des inputs
            formulaire.addEventListener("submit", (e) => { //on écoute l'événement submit, qd il se déclenche, on empeche le comportement par défaut et on appelle la fonction formCheck
                e.preventDefault();
                formCheck();
            });
        }
        
    } else {
        alert("Un problème est survenu, merci de réessayer plus tard");
    }
}
            
// creation de la fonction pour mettre à jour le contenu du panier (une association id/option équivaut à un élément du panier, même en plusieurs exemplaires dans le panier)
function majContenuPanier() {
    for (let i=0; i < camerasArray.length; i++){ //pour chaque élément du Array issu de l'API
        for (let j=0; j < camerasArray[i].lenses.length; j++){ //pour chaque option de chaque élément du Array de l'API
            if (localStorage.getItem("qte_"+camerasArray[i]._id+"/"+camerasArray[i].lenses[j]) != null && localStorage.getItem("qte_"+camerasArray[i]._id+"/"+camerasArray[i].lenses[j])>=0) { //on cherche une correspondance avec les éléments du localStorage
                let localName=camerasArray[i].name;
                let localId=camerasArray[i]._id;
                let localOption = camerasArray[i].lenses[j];
                let localQuantity = localStorage.getItem("qte_"+camerasArray[i]._id+"/"+camerasArray[i].lenses[j])
                let localPrice = camerasArray[i].price;
                
                elementsPanier.push(new elementPanier(localName, localId, localOption, localQuantity, localPrice)); // en cas de correspondance on incrémente un objet elementPanier dans le tableau elementsPanier
            }
        }
    }
    console.log(elementsPanier);
    return elementsPanier;
}         

function afficherBadgePanier() {
    badgePanier.innerHTML=`${elementsPanier.length}`;
}

// Example starter JavaScript for disabling form submissions if there are invalid fields
function animationInput() {
  'use strict'

  // On crée une variable qui selectionne tous les forms sur lesquels on veut appliquer le style via une classe specifique
  var forms = document.querySelectorAll('.needs-validation');

  // On boucle sur les forms, on empeche la soumission et on vérifie la conformité à chaque change sur chaque input
  Array.prototype.slice.call(forms)
    .forEach(function (form) {
      form.addEventListener('change', function (event) {
        if (!form.checkValidity()) {
            event.preventDefault()
            event.stopPropagation()
        }

        form.classList.add('was-validated')
      }, false)
    })
}


//fonction qui 
function formCheck() {
    const form = document.querySelector('.needs-validation');
    const orderInput = form.getElementsByTagName('input');
    console.log(orderInput);
    
    //pour chaque element required du formulaire, on vérifie que l'entrée est valide
    for (let i=0; i < orderInput.length; i++){
       if (orderInput[i].required){
           if(orderInput[i].value && orderInput[i].validity.valid){
            } else {
                alert("Merci de remplir correctement le "+ orderInput[i].name + " ou de vérifier la conformité avec le format attendu!!")
                return false;
            }
       } 
    }
    
    //on crée l'objet contact qui servira dans la requete POST et qui prendra comme valeurs les entrées des champs required du formulaire
    const contact = {
      firstName: orderInput[0].value,
      lastName: orderInput[1].value,
      address: orderInput[2].value,
      city: orderInput[4].value,
      email: orderInput[6].value
    }
    
    console.log(contact);
    
    // on crée le tableau product qui prendra comme valeur les id des produits que l'on commande
    let products = [];
    for (let i=0; i < elementsPanier.length; i++){
        products.push(elementsPanier[i].id);
    }
    let order = { contact, products };
    console.log(order);

    // requete post 
    var request = new XMLHttpRequest();
    request.open("POST", urlApiPOST);
    request.setRequestHeader("Content-Type", "application/json");
    request.send(JSON.stringify(order));
    request.responseType = 'json'; 
    
    //reponse de la requete
    request.onload = function () { 
        if (request.readyState === XMLHttpRequest.DONE ) { // verifie l'état de la requête. 
            if (request.status === 200 ||request.status === 201){
                console.log(request.response);
                let confirmation = request.response;
                console.log(confirmation);
                let idConfirmation = confirmation.orderId;
                console.log(idConfirmation);

                localStorage.setItem("orderNumber", idConfirmation); //on stocke dans le localStorage le numéro de commande renvoyé par l'API en reponse à la requete POST
                for (let i=0; i < elementsPanier.length; i++){ //on supprime les elements du paniers stockés dans le localStorage
                    localStorage.removeItem("qte_"+ elementsPanier[i].id + "/" + elementsPanier[i].option);
                }
                afficherMessageConfirmation(idConfirmation); //on appelle la fonction d'affichage de message de confirmation
            }
            else {
                console.log(error);
                alert("Un problème est survenu, merci de réessayer plus tard");
           }
        }
    }
        
    return true;
    
}

// creation fonction affichage message de confirmation
function afficherMessageConfirmation(orderNumber){
    formulaire.classList.add("d-none"); //on désactive l'affichage du formulaire
    message.classList.add("d-block"); //on active l'affichage du message
    document.getElementById("etape_2").classList.remove("badge-primary"); //on met à jour les couleurs des étapes du processus de commande
    document.getElementById("etape_2").classList.add("badge-success");
    document.getElementById("etape_3").classList.remove("badge-secondary");
    document.getElementById("etape_3").classList.add("badge-success");
    
    const pOrderNumber = document.getElementById("orderNumber"); //on recupere le numero de commande
    pOrderNumber.insertAdjacentHTML('beforeend', orderNumber); // on l'insère dans le message
    localStorage.removeItem("orderNumber"); //on supprime le numero de commande du localStorage
}