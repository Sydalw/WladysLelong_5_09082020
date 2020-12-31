const urlApiGET = "http://localhost:3000/api/cameras";
const urlApiPOST = "http://localhost:3000/api/cameras/order";
var camerasArray=""; 
const camerasContainer = document.querySelector('#camera_Container');
const recapCommande = document.querySelector('#recap_commande');
const totalElement = document.getElementsByClassName("total");
const badgePanier = document.querySelector('#badge_panier');


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
            // on cherche la bonne camera dans le array.
            majContenuPanier();
            afficherBadgePanier();
            animationInput();
        }
        
    } else {
        alert("Un problème est survenu, merci de réessayer plus tard");
    }
}
            
function majContenuPanier() {
    for (let i=0; i < camerasArray.length; i++){
        for (let j=0; j < camerasArray[i].lenses.length; j++){
            if (localStorage.getItem("qte_"+camerasArray[i]._id+"/"+camerasArray[i].lenses[j]) != null && localStorage.getItem("qte_"+camerasArray[i]._id+"/"+camerasArray[i].lenses[j])>=0) {
                let localName=camerasArray[i].name;

                let localId=camerasArray[i]._id;
                //console.log(localId);
                let localOption = camerasArray[i].lenses[j];
                //console.log(localOption);
                let localQuantity = localStorage.getItem("qte_"+camerasArray[i]._id+"/"+camerasArray[i].lenses[j])
                //console.log(localQuantity);
                let localPrice = camerasArray[i].price;
                
                elementsPanier.push(new elementPanier(localName, localId, localOption, localQuantity, localPrice));
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

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.querySelectorAll('.needs-validation');

  // Loop over them and prevent submission
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

function formCheck() {
    const form = document.querySelector('.needs-validation');
    // si la valeur du champ prenom est non vide
    const orderInput = form.getElementsByTagName('input');
    console.log(orderInput);
    
    for (let i=0; i < orderInput.length; i++){
       if (orderInput[i].required){
           if(orderInput[i].value && orderInput[i].validity.valid){
                //alert(orderInput[i].value+" "+orderInput[i].validity.valid);
            } else {
                alert("Merci de remplir correctement le "+ orderInput[i].name + " ou de vérifier la conformité avec le format attendu!!")
                return false;
            }
       } 
    }
    
    const contact = {
      firstName: orderInput[0].value,
      lastName: orderInput[1].value,
      address: orderInput[2].value,
      city: orderInput[4].value,
      email: orderInput[6].value
    }
    
    console.log(contact);
    

    let products = [];
    for (let i=0; i < elementsPanier.length; i++){
        alert(elementsPanier[i].id);
        products.push(elementsPanier[i].id);
    }
    alert(products);
    let order = { contact, products };
    console.log(order);
    alert(order);


    // requete post 
    var request = new XMLHttpRequest();
    request.open("POST", urlApiPOST);
    request.setRequestHeader("Content-Type", "application/json");
    request.send(JSON.stringify(order));
    request.responseType = 'json'; 
    
    alert("début");
    
    //reponse de la requete
    request.onload = function () { 
        if (request.readyState === XMLHttpRequest.DONE ) { // verifie l'état de la requête. 
            if (request.status === 200 ||request.status === 201){
                alert(request.response);
                console.log(request.response);
                let confirmation = request.response;
                console.log(confirmation);
                let idConfirmation = confirmation.orderId;
                alert(idConfirmation);
                console.log(idConfirmation);

                localStorage.setItem("orderNumber", idConfirmation);
                //localStorage.removeItem("");
            }
            else {
                console.log(error);
                alert("Un problème est survenu, merci de réessayer plus tard");
           }
        }
    }
        
    alert("fin");
    
    return true;
    
}