import React, {useState, useRef, useEffect} from 'react';
import {Text, View, StyleSheet, Dimensions} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import {Button} from "react-native-elements";
import * as Location from 'expo-location';
import * as Types from '../../../../types';


const MapScreen = ({ navigation }: Types.MapScreenNavigationProp) => {
  const [location, setLocation] = useState<number[]>([45.39174144302487, -79.21459743503355]);
  const [userLocation, setUserLocation] = useState<number[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  const [debugMode, setDebugMode] = useState(false);
  const map = useRef<MapView>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setUserLocation([location.coords.latitude, location.coords.longitude]);
    })();
  }, []);
    
  const [campsiteMarkers, setCampsiteMarkers] = useState<any[]>([]);
  // load random campsites near arrowhead
  useEffect(() => {
    setCampsiteMarkers(Array.from({length: 30}, (_, i) => { 
        return { num: i, latitude: location[0] + Math.random()/500, longitude: location[1] + Math.random()/500 }
    }));
  }, [])

  const CampsiteMarker = (props: any) => {
    const [clicked, setClicked] = useState(false);
    if (props.latitude && props.longitude) {
      return (<Marker 
        coordinate={{ latitude: props.latitude, longitude: props.longitude }} 
        image={{width: 200, height: 200, uri: "https://picsum.photos/200"}}
        onPress={() => setClicked(true)}
      />);
    }
    return null;
  }

  const moveUp = () => {
    setLocation([location[0], location[1] + 0.00001]);
  }
  const [mapLoaded, setMapLoaded] = useState(false);

  const [buttonMsg, setButtonMsg] = useState("hello");
  useEffect(() => {
    if (mapLoaded) {
      if (map.current && location) {
        map.current.animateCamera({
          center: {
            latitude: location[0],
            longitude: location[1]
          },
          altitude: 10, 
          pitch: 90, 
          heading: 0,
          zoom: 100
        }, { duration: 700 });
        setButtonMsg("world, " + location[1]);
      } else {
        setButtonMsg("world2");
      }
    } else {
      setMapLoaded(true);
    }
  }, [location])

  const camera: any = {
    center: {
      latitude: location[0],
      longitude: location[1]
    },
    altitude: 10, 
    pitch: 90, 
    heading: 0,
    zoom: 100
  }

  const region: any = {
    latitude: location[0],
    longitude: location[1],
    latitudeDelta: 0.00001,
    longitudeDelta: 0.00001
  }
  if (debugMode) {
    return (
      <View style={styles.container}>
        { errorMsg ? <Text> {errorMsg}</Text> : null }
        <Button title={"DEBUG MODE:" + buttonMsg} onPress={moveUp}></Button>
        <MapView 
          showsBuildings
          ref={map}
          style={styles.map} 
          mapType={"standard"}
          camera={camera}
          showsCompass={false}
        >
          {campsiteMarkers.map(obj => <CampsiteMarker key={obj.num} num={obj.num} latitude={obj.latitude} longitude={obj.longitude} />)}
        </MapView>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      { errorMsg ? <Text>{errorMsg}</Text> : null }
      <Button title={"LIVE MODE:" + buttonMsg} onPress={moveUp}></Button>
      <MapView 
        showsBuildings
        ref={map}
        style={styles.map} 
        mapType={"standard"}
        camera={camera}
        showsUserLocation={true}
        showsCompass={false}
        scrollEnabled={false} 
      >
        {campsiteMarkers.map(obj => <CampsiteMarker key={obj.num} num={obj.num} latitude={obj.latitude} longitude={obj.longitude} />)}
      </MapView>
    </View>
  )
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