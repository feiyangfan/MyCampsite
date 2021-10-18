import React, { useState, useRef, useEffect } from 'react';
import { Text, View, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import * as Types from '../../../../types';


const MapScreen = ({ navigation }: Types.MapScreenNavigationProp) => {
    const [latitude, setLatitude] = useState<number>(45.39174144302487);
    const [longitude, setLongitude] = useState<number>(-79.21459743503355);
    const [userLatitude, setUserLatitude] = useState<number | null>(null);
    const [userLongitude, setUserLongitude] = useState<number | null>(null);
    const [errorMsg, setErrorMsg] = useState<string>('');
    const map = useRef<MapView>(null);

    useEffect(() => {
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }
        let location = await Location.getCurrentPositionAsync({});
        setUserLatitude(location.coords.latitude);
        setUserLongitude(location.coords.longitude);
      })();
    }, []);

      let text: string = 'Waiting..';
      if (errorMsg) {
        text = errorMsg;
      } else if (location) {
        text = JSON.stringify(location);
      }
    
    const [campsiteMarkers, setCampsiteMarkers] = useState<any[]>([]);
    // load random campsites near arrowhead
    useEffect(() => {
      setCampsiteMarkers(Array.from({length: 30}, (_, i) => { 
          return { num: i, latitude: latitude + Math.random()/500, longitude: longitude + Math.random()/500 }
      }));
    }, [])

    const CampsiteMarker = (props: any) => {
      const [clicked, setClicked] = useState(false);
      if (props.latitude && props.longitude) {
          return (<Marker 
              coordinate={{ latitude: props.latitude, longitude: props.longitude }} 
              image={{width: 150, height: 150, uri: "https://picsum.photos/150"}}
              onPress={() => setClicked(true)}
          />);
      }
      return null;
    }

  return (
    <View style={styles.container}>
      { errorMsg ? <Text>{text}</Text> : null }
      <MapView 
        showsBuildings
        ref={map}
        style={styles.map} 
        mapType={"terrain"}
        region={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.001,
          longitudeDelta: 0.001
        }}
        onLayout={() => {
          setTimeout(() => {
            if (map && map.current) {
              map.current.animateCamera({ 
                center: {
                    latitude: latitude,
                    longitude: longitude
                },
                pitch: 90, 
                heading: 0
              });
            }
          }, 1000);
        }}
      >
          {campsiteMarkers.map(obj => <CampsiteMarker key={obj.num} num={obj.num} latitude={obj.latitude} longitude={obj.longitude} />)}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#EFEFEF',
    height: '100%'
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});

export default MapScreen;