# MissioLink_Front

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.1.5.

## Description
MissioLink_Front est une application web développée avec Angular et Capacitor, qui permet une expérience multiplateforme (web et mobile).

## Technologies utilisées
- Angular 19.1.0
- Capacitor 7.2.0 (pour le support mobile)
- Ng-Zorro Ant Design (UI Framework)
- Leaflet (pour la cartographie)

## Installation

1. Clonez le dépôt
2. Installez les dépendances :
```bash
npm install
```

## Démarrage

Pour lancer l'application en mode développement :
```bash
npm run start
```

Pour construire l'application en production :
```bash
npm run build
```

## Tests
Pour exécuter les tests unitaires :
```bash
npm run test
```

## Déploiement Android
1. Assurez-vous d'avoir Android Studio et les outils de développement Android installés
2. Construisez l'application pour Android :
```bash
npx cap sync android
npx cap open android
```

## Structure du projet
- `/src` : Source principale de l'application Angular
- `/android` : Configuration Capacitor pour Android
- `/public` : Assets publics
- `/node_modules` : Dépendances npm

## Scripts disponibles
- `ng serve` : Lance le serveur de développement
- `ng build` : Construit l'application
- `ng test` : Exécute les tests
- `ng watch` : Lance la compilation en mode watch

## Requis
- Node.js (version compatible avec Angular 19)
- npm
- Angular CLI
- Capacitor CLI
- Android Studio (pour le développement Android)

## License
MIT

## Contributing
Les contributions sont les bienvenues ! Veuillez lire le guide de contribution avant de soumettre une pull request.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
