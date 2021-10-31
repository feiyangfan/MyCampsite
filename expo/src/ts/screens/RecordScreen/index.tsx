import { useIsFocused } from '@react-navigation/core';
import { Audio } from 'expo-av';
import { Camera } from 'expo-camera'
import { CameraType, WhiteBalance } from 'expo-camera/build/Camera.types';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import * as Types from "../../types";

const RecordScreen = ({ route, navigation }: Types.RecordScreenNavigationProp) => {
  const [cameraPermission, setCameraPermission] = useState(false);
  const [audioPermission, setAudioPermission] = useState(false);

  const [cameraReference, setCameraRef] = useState<any | null>(null);

  /* console.log(cameraReference); */ 

  const [cameraType, setcameraType] = useState(Camera.Constants.Type.back);
  const [cameraFlash, setCameraFlash] = useState(Camera.Constants.FlashMode.off);

  const [cameraWorking, setCameraWorking] = useState(false);

  /* Variable that will tell us if we're still on the camera screen in case we go back in which case the camera will stop working*/
  const onCameraScreen = useIsFocused()

  /* Had to use useEffect twice because of the variable naming of status and the way typescript works */
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setCameraPermission(status === 'granted');
    })();
  }, []);
  useEffect(() => {
    (async () => {
      const { status } = await Audio.requestPermissionsAsync();
      setAudioPermission(status === 'granted');
    })();
  }, []);

  if (!cameraPermission || !audioPermission) {
    return (
      <View><Text style={{ marginTop: 50 }}>Camera/Audio Permission Not Given</Text></View>
    )
  }

  const startRecording = async () => {
    if (cameraReference) {
      try {
        const videoSettings = { maxDuration: 5, quality: Camera.Constants.VideoQuality['480'] }
        const recording = cameraReference.recordAsync(videoSettings)
        if (recording) {
          const data = await recording;
          const source = data.uri;
          {/* Ignore this error. Typescript just odd*/}
          navigation.navigate("AddPost", {source: source});
        }
      } catch (error) {
        console.warn(error)
      }
    }
  }
  const stopRecording = async () => {
    if (cameraReference) {
      cameraReference.stopRecording()
    }
  }

  return (
    <View style={styles.container}>
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
        </View>

        <View style={styles.recordButtonCont}>
          <TouchableOpacity
            style={styles.recordButton}
            disabled={!cameraWorking}
            onLongPress={() => startRecording()}
            onPressOut={() => stopRecording()}
          />
        </View>

        <View style={{ flex: 1 }}>
          <TouchableOpacity style={styles.flip} onPress = {() => setcameraType(cameraType === Camera.Constants.Type.front ? Camera.Constants.Type.back : Camera.Constants.Type.front)}>
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
    marginTop: 30,
  },
  camera: {
    flex: 1,
    backgroundColor: '#FF0000',
    aspectRatio: 9 / 16,

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
    borderColor: '#bebebebe',
    backgroundColor: '#3f3f3f',
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
  flashText: {
    color: 'white',
    fontSize: 12,
    marginTop: 5,
  }
});
export default RecordScreen;
