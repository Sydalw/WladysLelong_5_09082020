const urlApi = "http://localhost:3000/api/cameras";
let camerasArray=""; 
const camerasContainer = document.querySelector('#camera_Container');
const recapCommande = document.querySelector('#recap_commande');
const totalElement = document.getElementsByClassName("total");
const badgePanier = document.querySelector('#badge_panier');
const elementsAMasquer = document.getElementsByClassName("masquerSiVide");
const elementsAAfficher = document.getElementsByClassName("afficherSiVide");

class elementPanier {
    constructor(name, id, option, quantity, price){
        this.name = name;
        this.id = id;
        this.option = option;
        this.quantity = quantity;
        this.price = price;
    }
}

let elementsPanier = [];

console.log(camerasContainer);

let requete = new XMLHttpRequest;
requete.open('GET', urlApi);
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
            if (elementsPanier.length===0) {
                panierVide();
            }
            else {
                for(let element of elementsPanier){
                    trouverCamera(element);
                }
                majTOTAL();
                afficherBadgePanier();
                majQuantity();
                supprimer();
            }
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

//// creation de la fonction pour chercher la camera. 
function trouverCamera(element) {
    let i=0;
    while (i < camerasArray.length && camerasArray[i]._id != element.id) {
    i++; // tant qu'on est pas au bout du array et qu'on a pas trouvé la bonne caméra, on continue la boucle
    }
    afficherVignetteCamera(camerasArray[i], element); //on appelle la fonction d'affichage
}

// creation de la fonction pour afficher une camera
function afficherVignetteCamera(camera, element) {
    if (element.quantity >0){
        console.log(camera);
        const cameraElement = document.createElement('div');  
        cameraElement.setAttribute("class","row mb-2 mr-0");
        cameraElement.innerHTML = 
                `<div class="col-4">
                    <img src="${camera.imageUrl}" alt="certificat" class="card-img-top">
                </div>
                <div class="col-8 col-lg-7">
                    <div class="row ml-0 justify-content-between">
                        <h5>${camera.name}</h5>
                        <button type="button" class="btn btn-light text-muted border"><a class="text-decoration-none text-dark suppression" id="${element.id}/${element.option}">X</a></button>
                    </div>
                    <h6>${element.option}</h6>
                    <div class="row justify-content-between">
                        <form class="col-4 col-lg-3">
                            <div class="form-group">
                                <input type="number" class="form-control mb-4 choix-quantity" value="${element.quantity}" min="1" id="qte_${element.id}/${element.option}">
                            </div>
                        </form>
                        <div class="col-2 pr-0 text-right">
                            <p>${camera.price/100} €</p>
                        </div>
                    </div>
                </div>`;
        camerasContainer.appendChild(cameraElement);

        const recapElement = document.createElement('div');  
        recapElement.innerHTML = `<div class="row ml-0 justify-content-between text-secondary">
                            <h6>${element.quantity} x ${element.name}</h6>
                            <h6>${element.quantity*element.price/100}€</h6>
                        </div>`;
        recapCommande.appendChild(recapElement);
    }
}

function majTOTAL(){
    let TOTAL = 0;
    for(let element of elementsPanier){
        TOTAL+=element.quantity*element.price;
    }
    for (let elt of totalElement) {
        elt.innerHTML=`${TOTAL/100}€`;
    }
}

function afficherBadgePanier() {
    badgePanier.innerHTML=`${elementsPanier.length}`;
}

function majQuantity() {
    
    // Sélectionner l'élément input et récupérer sa valeur
    let elementsQuantity = document.getElementsByClassName("choix-quantity");
    
    for (let eltQuantity of elementsQuantity){
        eltQuantity.addEventListener('change', updateValue);
    
        function updateValue(e){
            var maQuantite = e.target.value;
            //alert(eltQuantity.getAttribute("id"));
            console.log(maQuantite);
            localStorage.setItem(eltQuantity.getAttribute("id"), maQuantite);
            document.location.reload();
        }
    }
}

function supprimer() {
    // Sélectionner l'élément input et récupérer sa valeur
    //alert("c'est lancé");
    let elementsSuppression= document.getElementsByClassName("suppression");
    
    for (let eltSuppression of elementsSuppression){
        eltSuppression.addEventListener('click', deleteValue);

    
        function deleteValue(){
            localStorage.removeItem("qte_"+eltSuppression.getAttribute("id"));
            document.location.reload();
        }
    }
}

function panierVide() {
    for (let eltM of elementsAMasquer) {
        eltM.classList.add("d-none");
    }
    for (let eltA of elementsAAfficher) {
        eltA.classList.add("d-block");
    }
}
