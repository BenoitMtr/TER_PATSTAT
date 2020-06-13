# databaseFetcher

## Prérequis

Pour utiliser ses script il faut la base de données PATSTAT dans MYSQL,
la connexion se fait en se créant un tunnel SSH sur un bastion puis le serveur où se trouve le MYSQL,
le port utilisé est pris aléatoirement entre 33000 et 33999 et nécessite un fichier du configuration à la racine

### Contenu fichier de configuration (cred.json)

```javascript
module.exports = {
    bastion_host: "SERVEUR_BASTION",
    db_host: "SERVEUR_MYSQL",
    user: "IDENTIFIANT_BASTION",
    db_user: "IDENTIFIANT_MYSQL",
    db_pass: "MOT_DE_PASSE_MYSQL",
    privateKey: require("fs").readFileSync("CHEMIN_CLE_PRIVEE"),
    passphrase: "MOT_DE_PASSE_CLE_PRIVEE*"
};
```

## Installation

Toute les dépendances sont dans le package.json donc il suffit d'effecteur la commande suivante à la racine:

```bash
npm i
```

## Utilisation

Pour vérifier si tout fonctionne lancer le fichier db_summary

```bash
node db_summary.js
```

Note : **Certaines requêtes peuvent mettre beaucoup de temps à calculer**

### Récupération des données

Pour récupérer les dernières informations de votre base de données PATSTAT il suffit de lancer le fichier fetchingDatasets.js

```bash
node fetchingDatasets.js
```

Le script vas récupérer les NUTS, les informations sur les brevets et les collaborations et vas tout sauvegarder dans le dossier _out_ et dans 3 fichiers _nuts.json_, _nbBrevets.json_ et _collab.json_

Note : **Certaines requêtes peuvent mettre beaucoup de temps à calculer**

Une fois terminée il suffit de déplacer les fichiers au Frontend dans le dossier assets/data
