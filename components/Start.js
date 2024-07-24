import React, { useState } from 'react';
import { ImageBackground, StyleSheet, View, Text, TextInput, Button, Image, TouchableOpacity, Alert } from 'react-native';
import { getAuth, signInAnonymously } from "firebase/auth";


const Start = ({ navigation }) => {

  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const image = require('../img/BackgroundImage.png');
  const icon = require('../img/icon.svg');


  const auth = getAuth();

  const signInUser = () => {
    signInAnonymously(auth)
    .then( result => {
      navigation.navigate('Chat', {name: name, backgroundColor: selectedColor, id: result.user.uid});
      Alert.alert('Signed in succeccfully');
    }).catch((error) => {
      Alert.alert('Unable to signin, try later');
    })
  };

  const handleColorSelection = (color) => {
    setSelectedColor(color);
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={image} resizeMode="cover" style={styles.image}>
        <Text style={styles.text}>Chat App</Text>

        <View style={styles.containerWhite}>
          <View style={styles.inputContainer}>
            <Image source={icon} style={styles.icon} />
            <TextInput
              style={styles.textInput}
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              placeholderTextColor="#757083"
            />
          </View>

          <Text style={styles.text1}>Choose Background Color:</Text>

          <View style={styles.colorButtonsContainer}>
            {['#090C08', '#474056', '#8A95A5', '#B9C6AE'].map(color => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorButton,
                  { backgroundColor: color, opacity: selectedColor === color ? 1 : 0.7 },
                ]}
                onPress={() => handleColorSelection(color)}
              />
            ))}
          </View>

          <Button
            //onPress={handleStartChatting}
            onPress= {signInUser}
            title="Start Chatting"
            color="#757083"
          />
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
  },
  containerWhite: {
    width: '88%',
    height: '44%',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: '6%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  text: {
    fontSize: 45,
    fontWeight: '600',
    color: 'white',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#757083',
    padding: 10,
    width: '100%',
    borderRadius: 10,
    marginBottom: 10,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  text1: {
    fontSize: 16,
    color: '#757083',
    fontWeight: '300',
    marginVertical: 10,
  },
  colorButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginVertical: 20,
  },
  colorButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});

export default Start;
