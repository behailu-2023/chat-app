import React, {useEffect} from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Start from './components/Start';
import Chat from './components/Chat';
import { initializeApp } from "firebase/app";
import { getFirestore, disableNetwork,enableNetwork } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { LogBox } from 'react-native';
import { useNetInfo } from '@react-native-community/netinfo';


LogBox.ignoreLogs(["AsyncStorage has been extracted from"]);
const Stack = createNativeStackNavigator();

const App = () => {
  const connectionStatus = useNetInfo();

  useEffect(() => {
    if (connectionStatus.isConnected === false) {
      Alert.alert("Connection lost!");
      disableNetwork(db);
    } else if (connectionStatus.isConnected === true) {
      enableNetwork(db);
    }
  }, [connectionStatus.isConnected]);

  //  Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBr5uv8tFuq-dZcGNQASHPxp8-HvnvkxnQ",
  authDomain: "chat-app-27d04.firebaseapp.com",
  projectId: "chat-app-27d04",
  storageBucket: "chat-app-27d04.appspot.com",
  messagingSenderId: "1039834718653",
  appId: "1:1039834718653:web:8dae9eaa9f16946f00b2d4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// Initialize Firebase Storage handler
const storage = getStorage(app);


  


  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Start"
        //screenOptions={{headerStyle: { backgroundColor: '#090C08' },headerTintColor: '#fff',}}
      >
        <Stack.Screen
          name="Start"
          component={Start}
          options={{ title: 'Welcome to Chat App' }}
        />
        <Stack.Screen
          name="Chat"
        >
          {props => <Chat
            isConnected={connectionStatus.isConnected}
            db={db}
            storage={storage}
            {...props}
          />}
        </Stack.Screen>
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
