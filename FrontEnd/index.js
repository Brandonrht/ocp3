const apiUrl = 'http://localhost:5678/api/'   //Stockage de l'adresse de l'API

console.log("je suis la ")

let idcat=0

//categoriestest
async function getApiCategories() {
    const response = await fetch(`${apiUrl}categories`);

    const cat = await response.json();

    return cat;
}


getApiCategories().then((data) => {
console.log(data)
const filter = document.querySelector(".filters")
filter.innerHTML = ""
buttoncat = document.createElement("button")
buttoncat.value = 0
buttoncat.textContent = "Tous"
buttoncat.className = "bouton-filtre"
filter.appendChild(buttoncat)
for (let i = 0; i < data.length; i++) {
buttoncat = document.createElement("button")
buttoncat.className = "bouton-filtre"   
buttoncat.value = data[i].id
buttoncat.textContent = data[i].name
filter.appendChild(buttoncat)
}
clickbutton()
})



//projettest
async function getApiwork() {

    const response = await fetch(`${apiUrl}works`);
    pro = await response.json();

    return pro;

}

getApiwork(idcat).then((data) => {  /// essayer de mettre dans une fonction affiche work pour appeller get apiwork
    console.log(data)
    const gallery = document.querySelector(".gallery");  //les image s'affiche pas quand je les retire du html
    console.log(gallery)                                 // acces dom " galerie "
    gallery.innerHTML = ""                                 // vide " galerie"
    console.log(idcat)
    for (let i = 0; i < data.length; i++) {
        // if (data[i].categoryId == idcat) {   
        workcard = document.createElement("figure")            //cree ellement figure dans le dom
        gallery.appendChild(workcard)
        workimg = document.createElement("img")
        workimg.src = data[i].imageUrl
        workimg.alt = data[i].title
        workcard.appendChild(workimg)                      //ajouter element enfant
        worktitle = document.createElement("figcaption")    //creat element
        worktitle.innerText = data[i].title
        //ajouter element  enfant 
        workcard.appendChild(worktitle)
        // }
    }
})

 function clickbutton(){


let monbouton = document.getElementsByClassName("bouton-filtre");

    Array.from(monbouton).forEach(_button => {
        _button.addEventListener("click", (event) => {
            let valeur = event.target.value;
            console.log("j'ai cliqué",event,valeur);
            getApiwork(valeur);
            
         });
    });
}

// je test le commit config






