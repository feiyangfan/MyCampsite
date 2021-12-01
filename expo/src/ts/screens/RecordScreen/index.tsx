import { useIsFocused } from '@react-navigation/core';
import { Audio } from 'expo-av';
import { Camera } from 'expo-camera'
import { CameraType, WhiteBalance } from 'expo-camera/build/Camera.types';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker'
import * as Types from "../../types";

const RecordScreen = ({ route, navigation }: Types.RecordScreenNavigationProp) => {
  // Variable created to keep track of camera permission
  const [cameraPermission, setCameraPermission] = useState(false);
  // Variable created to keep track of audio permission
  const [audioPermission, setAudioPermission] = useState(false);
  // Variable created to keep track of camera roll permission
  const [cameraRollPermission, setCameraRollPermission] = useState(false);

  // Variable created for actual camera
  const [cameraReference, setCameraRef] = useState<any | null>(null);

  /* console.log(cameraReference); */

  // Variable to keep track of whether we're using back or front camera
  const [cameraType, setcameraType] = useState(Camera.Constants.Type.back);

  // Variable to keep track of whether the flash is on or not
  const [cameraFlash, setCameraFlash] = useState(Camera.Constants.FlashMode.off);

  // Variable to keep track of whether the camera is working or not
  const [cameraWorking, setCameraWorking] = useState(false);

  /* Variable that will tell us if we're still on the camera screen in case we go back in which case the camera will stop working*/
  const onCameraScreen = useIsFocused()

  /* Had to use useEffect twice because of the variable naming of status and the way typescript works */
  // Ask and store whether camera permissions have been given
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setCameraPermission(status === 'granted');
    })();
  }, []);
  // Ask and store whether audio permissions have been given
  useEffect(() => {
    (async () => {
      const { status } = await Audio.requestPermissionsAsync();
      setAudioPermission(status === 'granted');
    })();
  }, []);
  // Ask and store whether camera roll permissions have been given
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      setCameraRollPermission(status === 'granted');
    })();
  }, []);

  // Fallback page if neither camera or audio permissions are given. 
  if (!cameraPermission || !audioPermission) {
    return (
      <View><Text style={{ marginTop: 50 }}>Camera/Audio Permission Not Given</Text></View>
    )
  }

  // function to start recording
  const startRecording = async () => {
    // check if we have a camera reference (referencing the device camera)
    if (cameraReference) {
      try {
        // set the video settings. 
        // max duration: 60 seconds is fine for this project.
        // quality: is being recorded at 480p for optimized storage
        const videoSettings = { maxDuration: 60, quality: Camera.Constants.VideoQuality['480'] }
        // actual recording part
        const recording = cameraReference.recordAsync(videoSettings)
        if (recording) {
          const data = await recording;
          const source = data.uri;
          {/* Ignore this error. Typescript just odd*/ }
          // After the recording is done, we want to send the video path saved on the device locally to
          // the AddPost screen where users can add a description and upload the video
          navigation.navigate("AddPost", { source: source });
        }
      } catch (error) {
        // Error Handling
        console.warn(error)
      }
    }
  }
  // function to stop the recording
  const stopRecording = async () => {
    if (cameraReference) {
      // stop the recording from accessing the camera reference and stopping it
      cameraReference.stopRecording()
    }
  }

  // funciton to pick a video from the camera roll
  const chooseFromCameraRoll = async () => {
    // Picking an image
    let attempt = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      aspect: [16, 9],
      quality: 1,
    })
    // If our attempt at chooosing a video is successful, send the video path saved on the device locally to
    // the AddPost screen where users can add a description and upload the video
    if (!attempt.cancelled) {
      navigation.navigate("AddPost", { source: attempt.uri });
    }

  }

  return (
    <View style={styles.container}>
      {/*Ternary expression to check if our camera is open on the screen*/}
      {onCameraScreen ?
        <Camera
          ref={ref => setCameraRef(ref)}
          onCameraReady={() => setCameraWorking(true)}
          style={styles.camera}
          ratio={'16:9'}
          type={cameraType}
          flashMode={cameraFlash}
        />
        : null}

      <View style={styles.btmContainer}>

        <View style={{ flex: 1 }}>
          <TouchableOpacity style={styles.gallery} onPress={() => chooseFromCameraRoll()}>
            <MaterialIcons name="add-photo-alternate" size={35} color="white" />
            <Text style={styles.flashText}>Gallery</Text>
          </TouchableOpacity>
        </View>
        {/*Once we let go of the recording button, stop the recording*/}
        <View style={styles.recordButtonCont}>
          <TouchableOpacity
            style={styles.recordButton}
            disabled={!cameraWorking}
            onLongPress={() => startRecording()}
            onPressOut={() => stopRecording()}
          />
        </View>

        <View style={{ flex: 1 }}>
          <TouchableOpacity style={styles.flip} onPress={() => setcameraType(cameraType === Camera.Constants.Type.front ? Camera.Constants.Type.back : Camera.Constants.Type.front)}>
            <Ionicons name="md-camera-reverse-outline" size={35} color="white" />
            <Text style={styles.flashText}>Flip</Text>
          </TouchableOpacity>
        </View>
      </View>



    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  btmContainer: {
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
  },
  recordButtonCont: {
    flex: 1,
    marginHorizontal: 30
  },
  recordButton: {
    borderWidth: 8,
    borderColor: '#ACDF87',
    backgroundColor: '#1E5631',
    borderRadius: 100,
    height: 80,
    width: 80,
    alignSelf: 'center',
    marginBottom: 50
  },
  flip: {
    borderColor: 'grey',
    overflow: 'hidden',
    width: 50,
    height: 60,
    marginBottom: 45,
    alignItems: 'center'
  },
  gallery: {
    borderColor: 'grey',
    overflow: 'hidden',
    width: 50,
    height: 60,
    marginBottom: 45,
    marginLeft: 60,
    alignItems: 'center'
  },
  flashText: {
    color: 'white',
    fontSize: 12,
    marginTop: 5,
  }
});
export default RecordScreen;
