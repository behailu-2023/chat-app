import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { addDoc, collection, onSnapshot, query, orderBy } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomActions from './CustomActions';
import MapView from 'react-native-maps';

const Chat = ({ route, navigation, db,isConnected, storage}) => {
  const [messages, setMessages] = useState([]);
  const { name, backgroundColor, id } = route.params;
 
  // useEffect hook to set messages options
  let unsubMessages;
  useEffect(() => {
    navigation.setOptions({ title: name });

    if (isConnected) {
        // unregister current onSnapshot() listener to avoid registering multiple listeners when
      // useEffect code is re-executed.
        if (unsubMessages) unsubMessages();
        //unsubMessages = null;

       // Create a query to get the "messages" collection from the Firestore database
    const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
       // This function will be called whenever there are changes in the collection.
    const unsubMessages = onSnapshot(q, (documentsSnapshot) => {
      let newMessages = [];
        // Iterate through each document in the snapshot
      documentsSnapshot.forEach(doc => {
        newMessages.push({
          id: doc.id, ...doc.data(),
          createdAt: new Date(doc.data().createdAt.toMillis()),
        });
      });
      cacheMessages(newMessages);
      setMessages(newMessages);
    });
} else loadCachedMessages();
       // Clean up code
    return () => {
      if (unsubMessages) unsubMessages();
    };
   }, [isConnected]);

   const cacheMessages = async (messagesToCache) => {
    try {
      await AsyncStorage.setItem("messages", JSON.stringify(messagesToCache));
    } catch (error) {
      console.log(error.message);
    }
  };
    // Call this function when isConnected prop turns out to be false in useEffect()
  const loadCachedMessages = async () => {
    // The empty array is for cachedMessages in case AsyncStorage() fails when the messages item hasn’t been set yet in AsyncStorage.
    const cachedMessages = (await AsyncStorage.getItem("messages")) || [];
    setMessages(JSON.parse(cachedMessages));
  };

    const onSend = (newMessages) => {
        addDoc(collection(db, "messages"), newMessages [0]);
      };

  const renderBubble = (props) => {
    return (
    <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: "#000"
        },
        left: {
          backgroundColor: "#FFF"
        },
      }}
    />
    );
  };
  const renderInputToolbar = (props) => {
    if (isConnected === true) return <InputToolbar {...props} />;
    else return null;
  };
  const renderCustomActions = (props) => {
    return <CustomActions storage={storage} {...props} />;
  };

  const renderCustomView = (props) => {
    const { currentMessage} = props;
    if (currentMessage.location) {
      return (
          <MapView
            style={{width: 150,
              height: 100,
              borderRadius: 13,
              margin: 3}}
            region={{
              latitude: currentMessage.location.latitude,
              longitude: currentMessage.location.longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          />
      );
    }
    return null;
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
        <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        onSend={(messages) => onSend(messages)}
        renderInputToolbar={renderInputToolbar}
        renderActions={renderCustomActions}
        renderCustomView={renderCustomView}
        user={{
          _id: route.params.id,
          name
        }}
      />
      {Platform.OS === "ios"?<KeyboardAvoidingView behavior="padding" />: null}
      <Text style={styles.text}>Welcome, {name}!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1
    },
    text: {
        textAlign: 'center',
        marginBottom: 10,
        color: '#000',
      },
  });

export default Chat;
