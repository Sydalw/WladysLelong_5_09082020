const urlApi = "http://localhost:3000/api/cameras";
let camerasArray=""; 
const camerasContainer = document.querySelector('#camera_Container');
const badgePanier = document.querySelector('#badge_panier');

const eltQuantite = document.getElementById("quantite");
const eltOption = document.getElementById("choix-option");


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

//console.log(camerasContainer);


//on recupère l'id de l'élément à afficher dans l'url
var position = window.location.href.indexOf('?');
//var identifiant; 

if(position!=-1) {
    var identifiant = window.location.href.substr(position + 1);
}

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
            majContenuPanier();
            trouverCamera(); // on cherche la bonne camera dans le array.
            }
            afficherBadgePanier();
            const formulaire = document.getElementById("formulaire");
            formulaire.addEventListener("submit", (e) => { //on écoute l'événement submit, qd il se déclenche, et on appelle la fonction getValues
                getValues();
            });
        
    } else {
        alert("Un problème est survenu, merci de réessayer plus tard");
    }
 }

//// creation de la fonction pour trouver la bonne camera. 
function trouverCamera() {
    let i=0;
        console.log(camerasArray[i]);
    while (i < camerasArray.length && camerasArray[i]._id != identifiant) {
    i++; // tant qu'on est pas au bout du array et qu'on a pas trouvé la bonne caméra, on continue la boucle
    }
    //alert(i);
    afficherCamera(camerasArray[i]);//on appelle la fonction d'affichage

}

// creation de la fonction pour afficher une camera
function afficherCamera(camera) {
    console.log(camera);
     const cameraElement = document.createElement('div');  
     cameraElement.setAttribute("class","row mt-5");
     cameraElement.innerHTML = 
            `<div class="col-12 col-lg-8">
                <div id="myCarousel" class="carousel slide d-lg-none" data-ride="carousel">
                    <ol class="carousel-indicators">
                        <li data-target="#myCarousel" data-slide-to="0" class="active"></li>
                        <li data-target="#myCarousel" data-slide-to="1"></li>
                        <li data-target="#myCarousel" data-slide-to="2"></li>
                      </ol>
                    <div class="carousel-inner">
                        <div class="carousel-item active">
                            <img src="${camera.imageUrl}" class="d-block w-100" alt="${camera.name}">
                        </div>
                        <div class="carousel-item">
                            <img src="${camera.imageUrl}" class="d-block w-100" alt="${camera.name}">
                        </div>
                        <div class="carousel-item">
                            <img src="${camera.imageUrl}" class="d-block w-100" alt="${camera.name}">
                        </div>
                    </div>
                    <a class="carousel-control-prev" href="#myCarousel" role="button" data-slide="prev">
                        <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span class="sr-only">Previous</span>
                    </a>
                    <a class="carousel-control-next" href="#myCarousel" role="button" data-slide="next">
                        <span class="carousel-control-next-icon" aria-hidden="true"></span>
                        <span class="sr-only">Next</span>
                    </a>          
                </div>        
                <div class="row d-none d-lg-flex mb-4">
                    <div class="col-lg-6">
                        <img src="${camera.imageUrl}" alt="${camera.name}" class="card-img-top" >
                    </div>
                    <div class="col-lg-6">
                        <img src="${camera.imageUrl}" alt="${camera.name}" class="card-img-top" >
                    </div>
                </div>
                <div class="row  d-none d-lg-flex mb-4">
                    <div class="col-lg-12">
                        <img src="${camera.imageUrl}" alt="${camera.name}" class="card-img-top" >
                    </div>
                </div>
            </div>
            <div class="col-12 col-lg-4 text-justify">
                <h4>${camera.name}</h4>
                <h5>La fabuleuse caméra ${camera.name}</h5>
                <p>${camera.description}</p>
                <p>${camera.price/100} €</p>
                <form method="link" action="panier.html" id="formulaire">
                    <div class="form-group">
                        <label for="quantité">Choisissez une quantité </label></br>
                        <input type="number" value="1" min="1" class="form-control mb-4" id="quantite">
                    </div>
                    <div class="form-group">
                        <label>Choisissez une option </label>
                        <select class="form-control" id="choix-option">
                        </select> 
                    </div>
                    <input type="submit" class="btn btn-secondary btn-lg btn-block" value="Ajouter au panier" href="panier.html">
                </form>
                <p><em>Livraison offerte pour toute commande livrée en France</em></p>
            </div>`;
    camerasContainer.appendChild(cameraElement); 
    
    const mesOptions = document.getElementById("choix-option");
    
    for (let i=0; i < camera.lenses.length; i++) {
        let monOption = document.createElement('option');
        monOption.innerHTML = `<option>${camera.lenses[i]}</option>`;
        mesOptions.appendChild(monOption);
        console.log(camera.lenses[i]);
    }      
 }


function getValues() {
    
    // Sélectionner l'élément input et récupérer sa valeur
    var monOption = document.getElementById("choix-option").value;
    var maQuantite = Number(document.getElementById("quantite").value);
    var oldQuantity = Number(localStorage.getItem('qte_'+identifiant+'/'+monOption));
    console.log(oldQuantity);
    maQuantite+=oldQuantity;
    localStorage.setItem('qte_'+identifiant+'/'+monOption, maQuantite);
    
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