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

        // Afficher les éléments avec la classe "admin"
        const adminElements = document.querySelectorAll(".admin");
        adminElements.forEach(element => {
            element.style.display = "block";
        });
    } else {
        // Afficher les filtres et les travaux si l'utilisateur n'est pas connecté
        await AfficheBouttonFiltre();
        await AfficheWorks();

        // Cacher la classe "admin"
        const adminElements = document.querySelectorAll(".admin");
        adminElements.forEach(element => {
            element.style.display = "none";
        });

        // Cacher le bouton Modifier
        const modifierButton = document.querySelector(".bts-modif");
        if (modifierButton) {
            modifierButton.style.display = "none";
        }

        // Cacherla classe "adminmode"
        const adminModeElement = document.querySelector(".adminmode");
        if (adminModeElement) {
            adminModeElement.style.display = "none";
        }
    }
    // Ajouter l'écouteur d'événement pour la fermeture de la modal en cliquant en dehors
    addModalClickListener();
}

init();

// ajout logout
const logoutButton = document.querySelector(".logout-btn");
if (logoutButton) {
    logoutButton.addEventListener("click", () => {
        sessionStorage.removeItem("SB_token");  // Suppression du token de session
        window.location.replace("login.html");  // Redirection vers la page de login
    });
}

// Fonction pour afficher les travaux dans la modal
async function afficheWorksDansModal() {
    setupAddButton();
    const worksFromApi = await getApiWorks(); // Récupération des projets depuis l'API
    const galleryModal = document.querySelector(".gallery-modal"); // Sélection de la galerie dans la modal
    galleryModal.innerHTML = ""; // Nettoyage de la galerie existante   

    document.addEventListener('keydown', disableRefresh); // on desactive reactive la touche F5
    worksFromApi.forEach(work => {
        const workCard = document.createElement("figure");  // Création de la carte projet
        workCard.dataset.id = `categorie${work.categoryId}`;

        const workImgWrapper = document.createElement("div");  // Wrapper pour l'image et le logo
        workImgWrapper.className = "image-wrapper";

        const workImg = document.createElement("img");  // Image du projet
        workImg.src = work.imageUrl;
        workImg.alt = work.title;
        workImgWrapper.appendChild(workImg);

        const trashIcon = document.createElement("i");  // Logo de la poubelle
        trashIcon.className = "fas fa-trash-can trash-icon";  // Classe pour l'icône de la poubelle
        trashIcon.dataset.workId = work.id; // Ajout de l'ID du projet 
        trashIcon.addEventListener('click', () => {
            deleteWork(work.id);
            reafiche();
        });


        workImgWrapper.appendChild(trashIcon);
        workCard.appendChild(workImgWrapper);  // Ajout du wrapper à la carte projet
        galleryModal.appendChild(workCard);  // Ajout de la carte à la galerie de la modal
    });
}


async function reafiche() {
    await afficheWorksDansModal()
}

const modal = document.getElementById("myModal");
const closeButton = document.querySelector(".close");


bts_modif.addEventListener('click', async function () {
    await afficheWorksDansModal(); // apelle fonction travaux
    modal.style.display = 'block';  // afficher la modal
});


if (closeButton) {
    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';  // Fermer la modal
        document.removeEventListener('keydown', disableRefresh); //on reactive la touche F5
        resetModal();
        init(); //rafraichir les données une fois la modale quitté
    });
}

// Fonction pour supprimer un projet
async function deleteWork(workId) {     //  declarer la Fonction
    const token = sessionStorage.getItem("SB_token");  // on recupere le token
    const response = await fetch(`${apiUrl}works/${workId}`, {  // 
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if (!response.ok) {  //  verfier la reponse
        throw new Error(`Erreur lors de la suppression du projet : ${response.status}`);
    }
    return response.status;
}

function disableRefresh(event) {
    if ((event.key === 'F5') || (event.ctrlKey && event.key === 'r')) {
        event.preventDefault();
        //        alert("Le rafraîchissement de la page est désactivé !");
    }
}


// Fonction pour remplir les catégories dans le formulaire d'ajout
async function remplirCategoriesFormulaire() {
    const categories = await getApiCategories();
    const selectElement = document.getElementById('workCategory');
    selectElement.innerHTML = '';

    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        selectElement.appendChild(option);
    });
}

// Fonction pour afficher le formulaire d'ajout de photo
function setupAddButton() {
    const addButton = document.querySelector('.bts-ajout');
    const formContainer = document.querySelector('.form-container');
    const galleryModal = document.querySelector('.gallery-modal');
    const modalTitle = document.getElementById('galleryTitle');
    const addPhotoTitle = document.getElementById('addPhotoTitle');
    const ajouterPhotoButton = document.getElementById('ajouterPhotoButton');
    const backIcon = document.querySelector('.back-icon'); // Sélectionner l'icône de flèche gauche

    if (addButton) {
        addButton.addEventListener('click', async () => {
            await remplirCategoriesFormulaire();
            galleryModal.style.display = 'none';
            formContainer.style.display = 'block';
            modalTitle.style.display = 'none';
            addPhotoTitle.style.display = 'block';
            ajouterPhotoButton.style.display = 'none';
            backIcon.style.display = 'block'; // Afficher l'icône de flèche gauche
        });
    }

    if (backIcon) {
        backIcon.addEventListener('click', () => {
            formContainer.style.display = 'none';
            galleryModal.style.display = 'grid';
            modalTitle.style.display = 'block';
            addPhotoTitle.style.display = 'none';
            ajouterPhotoButton.style.display = 'inline-block';
            backIcon.style.display = 'none';
        });
    }
}

if (closeButton) {
    closeButton.addEventListener('click', () => {
        modal.style.display = 'none';  // Fermer la modal
        document.removeEventListener('keydown', disableRefresh); //on reactive la touche F5
        init(); //rafraichir les données une fois la modale quitté
        const backIcon = document.querySelector('.back-icon'); // Sélectionner l'icône de flèche gauche
        backIcon.style.display = 'none'; // Masquer l'icône de flèche gauche
    });
}



// Fonction pour afficher l'aperçu de l'image sélectionnée
function displayImagePreview(event) {
    const imagePreviewContainer = document.getElementById('imagePreview');
    const uploadPhotoSection = document.getElementById('uploadPhotoSection');
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            imagePreviewContainer.innerHTML = ''; // Effacer le contenu précédent
            imagePreviewContainer.appendChild(img);
            uploadPhotoSection.classList.add('image-selected'); // Ajouter la classe pour masquer les éléments non nécessaires
        }
        reader.readAsDataURL(file);
    }
}

// déclaration de la fonction addImageChangeListener
function addImageChangeListener() {
    const workImageInput = document.getElementById('workImage');
    if (workImageInput) {
        workImageInput.addEventListener('change', displayImagePreview);
    } else {
        console.error('Élément de saisie d\'image non trouvé');
    }
}

// setupAddButton pour appeler addImageChangeListener
addImageChangeListener(); // Ajouter l'écouteur d'événement pour l'image ici

function addModalClickListener() {
    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            modal.style.display = 'none';
            document.removeEventListener('keydown', disableRefresh); // Réactiver la touche F5
            resetModal(); // Réinitialiser la modal à son état d'origine
            init();
        }
    });
}


// Fonction pour réinitialiser la modal
function resetModal() {
    const formContainer = document.querySelector('.form-container');
    const galleryModal = document.querySelector('.gallery-modal');
    const modalTitle = document.getElementById('galleryTitle');
    const addPhotoTitle = document.getElementById('addPhotoTitle');
    const ajouterPhotoButton = document.getElementById('ajouterPhotoButton');
    const backIcon = document.querySelector('.back-icon'); // Sélectionner l'icône de flèche gauche

    // Réinitialiser le formulaire
    const addWorkForm = document.getElementById('addWorkForm');
    addWorkForm.reset();

    // Réinitialiser l'aperçu de l'image
    const imagePreviewContainer = document.getElementById('imagePreview');
    imagePreviewContainer.innerHTML = '<i class="fa-regular fa-image" id="imageIcon"></i>'; // Remettre l'icône d'image
    const uploadPhotoSection = document.getElementById('uploadPhotoSection');
    uploadPhotoSection.classList.remove('image-selected');

    // Masquer et afficher les éléments appropriés
    formContainer.style.display = 'none';
    galleryModal.style.display = 'grid';
    modalTitle.style.display = 'block';
    addPhotoTitle.style.display = 'none';
    ajouterPhotoButton.style.display = 'inline-block';
    backIcon.style.display = 'none';
}

async function envoyerFormulaireAjoutPhoto(event) {
    event.preventDefault();

    const token = sessionStorage.getItem("SB_token");
    if (!token) {
        console.error("Token manquant");
        return;
    }

    const workImage = document.getElementById('workImage').files[0];
    const workTitle = document.getElementById('workTitle').value;
    const workCategory = document.getElementById('workCategory').value;

    if (!workImage || !workTitle || !workCategory) {
        console.error("Tous les champs du formulaire doivent être remplis");
        return;
    }

    const formData = new FormData();
    formData.append('image', workImage);
    formData.append('title', workTitle);
    formData.append('category', workCategory);

    try {
        const response = await fetch(`${apiUrl}works`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error(`Erreur lors de l'ajout du projet : ${response.status}`);
        }

        // Rafraîchir l'affichage après l'ajout de l'image
        console.log("Projet ajouté avec succès");
        resetModal();
        modal.style.display = 'none';
        await AfficheWorks();
    } catch (error) {
        console.error("Erreur :", error);
        alert("Une erreur s'est produite lors de l'ajout du projet. Veuillez réessayer.");
    }
}

// Ajoutez un écouteur d'événement pour le formulaire d'ajout de photo
document.getElementById('addWorkForm').addEventListener('submit', envoyerFormulaireAjoutPhoto);