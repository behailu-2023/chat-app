import React, { useState } from 'react';
import { StyleSheet, View, Text, TextInput, Button, Image, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";





const CustomActions = ({ wrapperStyle, iconTextStyle, onSend, storage, userID }) => {
    const actionSheet = useActionSheet();
   //display a menu with options (take photo, select photo, share location)
    const onActionPress = () => {
      const options = ['Choose From Library', 'Take Picture', 'Send Location', 'Cancel'];
      const cancelButtonIndex = options.length - 1;
      actionSheet.showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex,
        },
        async (buttonIndex) => {
          switch (buttonIndex) {
            case 0:
              pickImage();
              return;
            case 1:
              takePhoto();
              return;
            case 2:
              getLocation();
            default:
          }
        },
      );
    };
    // Function to upload an image to Firebase Storage and send its URL
    const uploadAndSendImage = async (imageURI) => {
        const uniqueRefString = generateReference(imageURI);
        const newUploadRef = ref(storage, uniqueRefString);
        const response = await fetch(imageURI);
          // Convert the image data into a Blob
        const blob = await response.blob();
        uploadBytes(newUploadRef, blob).then(async (snapshot) => {
          const imageURL = await getDownloadURL(snapshot.ref)
          onSend({ image: imageURL })
        });
      }
   // Function to pick an image from the device's media library
    const pickImage = async () => {
        let permissions = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (permissions?.granted) {
          let result = await ImagePicker.launchImageLibraryAsync();
          if (!result.canceled) await uploadAndSendImage(result.assets[0].uri); 
          else Alert.alert("Permissions haven't been granted.");
        }
      }
    // Function to take a photo using the device's camera
    const takePhoto = async () => {
      let permissions = await ImagePicker.requestCameraPermissionsAsync();
      if (permissions?.granted) {
        let result = await ImagePicker.launchCameraAsync();
        if (!result.canceled) await uploadAndSendImage(result.assets[0].uri); 
        else Alert.alert("Permissions haven't been granted.");
      }
    }
    // Function to get the current device location
    const getLocation = async () => {
      let permissions = await Location.requestForegroundPermissionsAsync();
      if (permissions?.granted) {
        const location = await Location.getCurrentPositionAsync({});
        if (location) {
            onSend({
                location: {
                  longitude: location.coords.longitude,
                  latitude: location.coords.latitude,
                },
              });
          //console.log('sending the location occurs here');
        } else Alert.alert("Error occurred while fetching location");
      } else Alert.alert("Permissions haven't been granted.");
    }
    // Function to generate a unique reference for an image based on user ID, current timestamp, and image name
    const generateReference = (uri) => {
        const timeStamp = (new Date()).getTime();
        const imageName = uri.split("/")[uri.split("/").length - 1];
        return `${userID}-${timeStamp}-${imageName}`;
      }
    return (
      <TouchableOpacity 
      accessible ={true} 
      accessibilityLabel="More options"
      accessibilityHint="Let's you choose to send an image or your geolocation."
      style={styles.container} onPress={onActionPress}>
        <View style={[styles.wrapper, wrapperStyle]}>
          <Text style={[styles.iconText, iconTextStyle]}>+</Text>
        </View>
      </TouchableOpacity>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      width: 26,
      height: 26,
      marginLeft: 10,
      marginBottom: 10,
    },
    wrapper: {
      borderRadius: 13,
      borderColor: '#b2b2b2',
      borderWidth: 2,
      flex: 1,
    },
    iconText: {
      color: '#b2b2b2',
      fontWeight: 'bold',
      fontSize: 16,
      backgroundColor: 'transparent',
      textAlign: 'center',
    },
  });
  
  export default CustomActions;