const urlApi = "http://localhost:3000/api/cameras";
let camerasArray=""; 
const camerasContainer = document.querySelector('#cameras-container');
const carouselContainer = document.querySelector('#carousel-container');
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

let elementsPanier = [];

// crée la requete
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
            majContenuPanier(); //on appelle la fonction qui met à jour le nombre d'éléments dans le panier
            afficherBadgePanier(); // on appelle la fonction qui affiche le nombre d'éléments dans le panier
            afficherCameras(); // affiche dynamiquement les vignettes et le carousel
            }
        
    } else {
        alert("Un problème est survenu, merci de réessayer plus tard");
    }
 }

// creation de la fonction pour afficher les cameras. 
function afficherCameras() {
    camerasArray.forEach(afficherCamera); //Pour chaque élément du Array, on appelle la fonction qui affiche la vignette
    camerasArray.forEach(afficherCarousel); //Pour chaque élément du Array, on appelle la fonction qui affiche le carousel
    const firstCarouselElement = document.querySelector("#carousel-container .carousel-item"); //on cherche le premier élément du carousel
    firstCarouselElement.classList.add("active"); //on lui donne la classe active pour l'afficher et commencer le défilement
}

// creation de la fonction pour afficher le carousel avec un élément du array comme argument
function afficherCarousel(camera) {
    const carouselElement = document.createElement('div'); 
    carouselElement.setAttribute("class","carousel-item");
    carouselElement.innerHTML = `<img src="${camera.imageUrl}" class="d-block w-100" alt="${camera.name}">`;
    carouselContainer.appendChild(carouselElement);
}

// creation de la fonction pour afficher une vignette
 function afficherCamera(camera) {
     const cameraElement = document.createElement('div');  
     cameraElement.setAttribute("class","ccol-12 col-lg-4");
     cameraElement.innerHTML = 
         `<div class="card mt-5 mb-4 mb-lg-0">
            <img src="${camera.imageUrl}" alt="${camera.name}" class="card-img-top" >
            <span class="position-absolute mr-3 mt-3 justify-content-end float-right badge btn-success" style="right: 0">New</span>
            <div class="card-body">
                <div class="row mb-3">
                    <h5 class="card-title mb-0 col-10 align-middle">${camera.name}</h5>
                    <span class="badge badge-pill badge-secondary col-2 align-self-center py-2">${camera.price/100} €</span>
                </div>
                <p class="card-text">${camera.description}</p>
                <button type="button" class="btn btn-secondary text-muted btn-lg btn-block"><a class="text-decoration-none text-white stretched-link" href="produit.html?${camera._id}">En savoir plus</a></button>
            </div>
        </div>`;
    camerasContainer.appendChild(cameraElement);
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