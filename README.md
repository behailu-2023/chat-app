# Chat-app
    Project overwiew
A mobile React Native chat-app, which provides users with a chat inteface and options to share images and their locationn.

Project Main Features

    * Send and receive messages
    * Choose a color theme
    * Choose a photo from library and share
    * Take a photo and share
    * share location
    * Store Data online and offline

Project Technologies and Depedencies

    * React Native
    * Expo and Expo Go App
    * Google Firestore Database
    * Android Studio and  Xcode Simulator

    Library
    * Gifted Chat
    * Expo ImagePicker
    * Expo MediaLibrary
    * Expo Location

Follow the following steps to start setup to build an app, to configure firebase instance and connect to the app.

1. Clone the Repository
2. Setting UP Expo
    * Check your Node version and make sure it's compataible with Expo.(Expo only supports Node 16.. at max,  so if you have a higher version than 16.., make sure to downgrade to “16.19.0”).
    * Install Expo CLI: 
        npm install -g expo-cli
    * Download Expo Go App for your phone to run your project on.
    * Expo Accont Head over to the Expo signup page https://expo.dev and follow the instructions to create an account.

3. Setting Up a Firestore Database
    * Head to https://firebase.google.com/ and Sign up/Sign In. Create a project/Add a project.
    Select Build-> Firestore Database-> Create Database->Start in Production mode->Next 
    on Rules tab change 'false' to 'true' -> allow read, write: if false; -> Publish
    * Next go to Project Settings->General Tab-> Your Apps-> Web(</>) then Register app.
    * After you register you copy-paste the const firebaseConfig = {...}; code into your App.js file. 
    * Firestore Authenticationn: on your Firestore project dasboard go to Build->Authentication->Get started->select Anonymous from the Sign-in providers option-> Enable-> Save.
Start the app 
    * npx expo start 
    


