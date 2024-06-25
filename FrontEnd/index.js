const apiUrl = 'http://localhost:5678/api/';  // Stockage de l'adresse de l'API

/* DEBUT APPEL DES API */
async function getApiWorks() {
    return await fetch(`${apiUrl}works`)
        .then((response) => response.json())
        .catch((error) => {
            console.log(`L'API works n'a pas répondu : ${error}`);
        });
}

async function getApiCategories() {
    return await fetch(`${apiUrl}categories`)
        .then((response) => response.json())
        .catch((error) => {
            console.log(`L'API categories n'a pas répondu : ${error}`);
        });
}
/* FIN APPEL DES API */

// Affichage de la galerie principale :
async function AfficheWorks() {
    const worksFromApi = await getApiWorks(); // Appel de l'API
    FiltreWorks(worksFromApi);                // Appel de la fonction d'affichage + servira à filtrer
}

function FiltreWorks(works, categoryId = null) {
    // on pointe la balise dans laquelle vont s'afficher les works
    const gallery = document.querySelector(".gallery");
    // on efface les éléments présents dans la galerie
    gallery.innerHTML = "";

    // Si un categoryId est fourni, on filtre les éléments
    if (categoryId) {
        works = works.filter((work) => work.categoryId === parseInt(categoryId));
    }

    // on affiche chaque projet (filtrés ou non), avec une boucle for
    for (let i = 0; i < works.length; i++) {
        // chaque projet sera contenu dans une <figure> ..
        const workcard = document.createElement("figure");
        workcard.dataset.id = `categorie${works[i].categoryId}`;
        gallery.appendChild(workcard);

        const workimg = document.createElement("img");
        workimg.src = works[i].imageUrl;
        workimg.alt = works[i].title;
        workcard.appendChild(workimg);

        const worktitle = document.createElement("figcaption");
        worktitle.innerText = works[i].title;
        workcard.appendChild(worktitle);
    }
}

async function AfficheBouttonFiltre() {
    const categoriesFromApi = await getApiCategories();
    formatBouttonCategories(categoriesFromApi);
}

function formatBouttonCategories(categories) {
    console.log(categories);
    const filter = document.querySelector(".filters");
    filter.innerHTML = "";

    // Bouton pour afficher tous les travaux
    let buttoncat = document.createElement("button");
    buttoncat.value = 0;
    buttoncat.textContent = "Tous";
    buttoncat.className = "bouton-filtre";
    filter.appendChild(buttoncat);

    for (let i = 0; i < categories.length; i++) {
        buttoncat = document.createElement("button");
        buttoncat.className = "bouton-filtre";
        buttoncat.value = categories[i].id;
        buttoncat.textContent = categories[i].name;
        filter.appendChild(buttoncat);
    }

    clickbutton();
}

function clickbutton() {
    let monbouton = document.getElementsByClassName("bouton-filtre");

    Array.from(monbouton).forEach(_button => {
        _button.addEventListener("click", async (event) => {
            let valeur = event.target.value;
            console.log("j'ai cliqué", event, valeur);
            const worksFromApi = await getApiWorks(); // Appel de l'API
            // Ici je lui passe tous les works et l'id sur lequel j'ai cliqué
            if (valeur == 0) {
                FiltreWorks(worksFromApi); // Afficher tous les travaux si "Tous" est cliqué
            } else {
                FiltreWorks(worksFromApi, valeur);
            }
        });
    });
}

// Initialiser l'affichage
AfficheWorks();
AfficheBouttonFiltre();



/***************************/
/******CODE DE BRANDON******/
/* console.log("je suis la ")

let idcat = 0 */

//categoriestest
/* async function getApiCategories() {
    const response = await fetch(`${apiUrl}categories`);

    const cat = await response.json();

    return cat;
} */


/* getApiCategories().then((data) => {
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
}) */



//projettest
/* async function getApiwork() {

    const response = await fetch(`${apiUrl}works`);
    pro = await response.json();

    return pro;

} */

/* getApiwork(idcat).then((data) => {  /// essayer de mettre dans une fonction affiche work pour appeller get apiwork
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
}) */
/*
function clickbutton() {
    let monbouton = document.getElementsByClassName("bouton-filtre");

    Array.from(monbouton).forEach(_button => {
        _button.addEventListener("click", (event) => {
            let valeur = event.target.value;
            console.log("j'ai cliqué", event, valeur);
            getApiwork(valeur);

        });
    });
} */

// je test le commit config
