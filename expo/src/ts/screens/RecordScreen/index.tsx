import { Audio } from 'expo-av';
import { Camera } from 'expo-camera'
import React, {useState, useEffect} from 'react'
import { View, Text } from 'react-native'

export default function RecordScreen() {
    const [cameraPermission, setCameraPermission] = useState(false);
    const [audioPermission, setAudioPermission] = useState(false);

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
      return(
        <View><Text style={{marginTop: 50}}>Camera/Audio Permission Not Given</Text></View>
      )
    }

    return (
        <View>
            <Text style={{marginTop: 30}}>Camera</Text>
        </View>
    )
}
