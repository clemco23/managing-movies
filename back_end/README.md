🎬 Node.js Movie Management API








API pour la gestion de films avec Node.js, Express et MongoDB. Permet de gérer les utilisateurs, les films et l’association des films aux utilisateurs.

🛠 Technologies utilisées

Node.js

Express.js

MongoDB avec Mongoose

JWT pour l’authentification

bcrypt pour le hash des mots de passe

Cors pour la communication frontend/backend

🚀 Fonctionnalités
Gestion des utilisateurs

Créer un utilisateur

Se connecter et récupérer un JWT

Modifier, supprimer et récupérer les informations d’un utilisateur (routes protégées)

Gestion des films

Ajouter un film (utilisateur connecté)

Récupérer tous les films (catalogue global)

Récupérer un film par ID

Validation : titre obligatoire, année de sortie entre 1800 et l’année en cours, image valide (.jpg, .png, etc.)

Association utilisateur/film

Chaque utilisateur peut ajouter des films à sa propre collection (User_Film)

Un film peut être ajouté par plusieurs utilisateurs sans duplication dans le catalogue global

Les utilisateurs ne voient que leurs films ajoutés



🔐 Authentification

JWT requis pour les routes protégées

Mettre le token dans l’header :
Authorization: Bearer <TOKEN>


🗂 Structure du projet : 
project/
│
├─ controllers/
│   ├─ filmController.js
│   ├─ userController.js
│   └─ userFilmController.js
│
├─ models/
│   ├─ Film.js
│   ├─ User.js
│   └─ User_Film.js
│
├─ routes/
│   ├─ filmRoutes.js
│   ├─ userRoutes.js
│   └─ userFilmRoutes.js
│
├─ middlewares/
│   └─ verifyToken.js
│
├─ index.js
├─ package.json
└─ .env

📦 Installation

Cloner le projet :

git clone <ton-repo-github>
cd <nom-du-dossier>
npm install
Créer un fichier .env avec :

MONGO_URI=<ton-URI-MongoDB>
JWT_SECRET=<clé-secrète-pour-jwt>
JWT_EXPIRES_IN=1d
PORT=3000

Lancer le serveur en développement :

npm run dev