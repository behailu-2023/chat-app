import { GiftedChat, Bubble, InputToolbar } from "react-native-gifted-chat";
import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { addDoc, collection, onSnapshot, query, orderBy } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";



const Chat = ({ route, navigation, db,isConnected, storage}) => {
  const [messages, setMessages] = useState([]);
  const { name, backgroundColor, id } = route.params;
 
  
  let unsubMessages;
  useEffect(() => {
    navigation.setOptions({ title: name });

    if (isConnected) {
        if (unsubMessages) unsubMessages();
        //unsubMessages = null;

    const q = query(collection(db, "messages"), orderBy("createdAt", "desc"));
    const unsubMessages = onSnapshot(q, (documentsSnapshot) => {
      let newMessages = [];
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
 
  const loadCachedMessages = async () => {
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
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
        <GiftedChat
        messages={messages}
        renderBubble={renderBubble}
        onSend={(messages) => onSend(messages)}
        enderInputToolbar={renderInputToolbar}
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
