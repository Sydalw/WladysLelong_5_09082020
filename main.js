const urlApiGET = "http://localhost:3000/api/cameras";
const urlApiPOST = "http://localhost:3000/api/cameras/order";
var camerasArray=""; 
const camerasContainer = document.querySelector('#camera_Container');
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
