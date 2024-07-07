const apiUrl = 'http://localhost:5678/api/';

// Fonction pour récupérer les projets depuis l'API
async function getApiWorks() {
    try {
        const response = await fetch(`${apiUrl}works`);
        if (!response.ok) {
            throw new Error(`Erreur lors de la récupération des projets : ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`L'API works n'a pas répondu : ${error}`);
        return [];
    }
}

// Fonction pour récupérer les catégories depuis l'API
async function getApiCategories() {
    try {
        const response = await fetch(`${apiUrl}categories`);
        if (!response.ok) {
            throw new Error(`Erreur lors de la récupération des catégories : ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`L'API categories n'a pas répondu : ${error}`);
        return [];
    }
}

// Affichage initial des projets
async function AfficheWorks(categoryId = null) {
    const worksFromApi = await getApiWorks(); // Récupération des projets depuis l'API
    FiltreWorks(worksFromApi, categoryId);    // Affichage des projets filtrés
}

// Affichage des projets filtrés par catégorie
function FiltreWorks(works, categoryId = null) {
    const gallery = document.querySelector(".gallery");  // Sélection de la galerie d'affichage
    gallery.innerHTML = "";  // Nettoyage de la galerie existante

    // Filtrage des projets par catégorie si categoryId est spécifié
    if (categoryId) {
        works = works.filter((work) => work.categoryId === parseInt(categoryId));
    }

    // Affichage de chaque projet dans une carte
    works.forEach(work => {
        const workCard = document.createElement("figure");  // Création de la carte projet
        workCard.dataset.id = `categorie${work.categoryId}`;

        const workImg = document.createElement("img");  // Image du projet
        workImg.src = work.imageUrl;
        workImg.alt = work.title;
        workCard.appendChild(workImg);

        const workTitle = document.createElement("figcaption");  // Titre du projet
        workTitle.innerText = work.title;
        workCard.appendChild(workTitle);

        gallery.appendChild(workCard);  // Ajout de la carte à la galerie
    });
}

// Affichage des boutons de filtre des catégories
async function AfficheBouttonFiltre() {
    const categoriesFromApi = await getApiCategories();  // Récupération des catégories depuis l'API
    formatBouttonCategories(categoriesFromApi);  // Formatage et affichage des boutons de filtre
}

// Formatage des boutons de filtre
function formatBouttonCategories(categories) {
    const filter = document.querySelector(".filters");  // Sélection du conteneur des filtres
    filter.innerHTML = "";  // Nettoyage des filtres existants

    // Bouton "Tous les travaux"
    let buttonAll = document.createElement("button");
    buttonAll.value = 0;
    buttonAll.textContent = "Tous";
    buttonAll.className = "bouton-filtre";
    filter.appendChild(buttonAll);

    // Boutons des catégories
    categories.forEach(category => {
        let buttonCat = document.createElement("button");
        buttonCat.className = "bouton-filtre";
        buttonCat.value = category.id;
        buttonCat.textContent = category.name;
        filter.appendChild(buttonCat);
    });

    // Écouteurs d'événements pour les boutons de filtre
    clickbutton();
}

// Ajout des écouteurs d'événements pour les boutons de filtre
function clickbutton() {
    const buttons = document.querySelectorAll(".bouton-filtre");  // Sélection de tous les boutons de filtre

    buttons.forEach(button => {
        button.addEventListener("click", async (event) => {
            const value = event.target.value;  // Récupération de la valeur du bouton cliqué
            const worksFromApi = await getApiWorks();  // Récupération des projets depuis l'API

            // Filtrage et affichage des projets en fonction de la catégorie sélectionnée
            if (value == 0) {
                FiltreWorks(worksFromApi);  // Affichage de tous les travaux si "Tous" est sélectionné
            } else {
                FiltreWorks(worksFromApi, value);  // Affichage des travaux filtrés par catégorie
            }
        });
    });
}

// Initialisation de l'affichage des projets et des filtres
async function init() {
    const token = sessionStorage.getItem("SB_token");

    // Si l'utilisateur est connecté
    if (token) {
        // Cacher le bouton de login
        const loginButton = document.querySelector(".login-btn");
        if (loginButton) {
            loginButton.style.display = "none";
        }

        // Afficher le bouton de logout
        const logoutButton = document.querySelector(".logout-btn");
        if (logoutButton) {
            logoutButton.style.display = "block";
        }

        // Cacher les filtres
        const filtersContainer = document.querySelector(".filters");
        if (filtersContainer) {
            filtersContainer.style.display = "none";
        }

        // Afficher tous les travaux
        await AfficheWorks();
    } else {
        // Afficher les filtres et les travaux si l'utilisateur n'est pas connecté
        await AfficheBouttonFiltre();
        await AfficheWorks();
    }
}

// Appel de la fonction d'initialisation
init();

// Gestion du logout
const logoutButton = document.querySelector(".logout-btn");
if (logoutButton) {
    logoutButton.addEventListener("click", () => {
        sessionStorage.removeItem("SB_token");  // Suppression du token de session
        window.location.replace("login.html");  // Redirection vers la page de login
    });
}



// Sélection du bouton "Modifier"
const modifierButton = document.querySelector('.bts-modif');

// Sélection de la modal
const modal = document.getElementById('myModal');

// Sélection du bouton de fermeture de la modal
const closeButton = document.querySelector('.close');

// Ajout d'un événement de clic au bouton "Modifier"
if (modifierButton) {
    modifierButton.addEventListener('click', function() {
        modal.style.display = 'block';  // Affichage de la modal
    });
}

// Fermeture de la modal lorsqu'on clique sur le bouton de fermeture
if (closeButton) {
    closeButton.addEventListener('click', function() {
        modal.style.display = 'none';  // Fermeture de la modal
    });
}

// Fermeture de la modal lorsqu'on clique en dehors de la modal
window.addEventListener('click', function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';  // Fermeture de la modal
    }
});
