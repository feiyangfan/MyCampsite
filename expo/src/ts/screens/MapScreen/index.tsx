import React, {useState, useRef, useEffect} from 'react';
import {View, StyleSheet, Dimensions, AppState} from 'react-native';
import MapView, { Camera, PROVIDER_GOOGLE }  from 'react-native-maps';
import {Text, Button} from "react-native-elements";
import * as Location from 'expo-location';
import * as Types from '../../../../types';
import MapCampsiteMarker from '../../components/MapCampsiteMarker';
import mapStyle from './map_style';
import {ExpoWebGLRenderingContext, GLView} from 'expo-gl';
import ExpoTHREE, {THREE} from 'expo-three';

const MapScreen = ({ navigation }: Types.MapScreenNavigationProp) => {
  const [location, setLocation] = useState<number[]>([45.39174144302487, -79.21459743503355]);
  const [userLocation, setUserLocation] = useState<number[]>([]);
  const [errorMsg, setErrorMsg] = useState('');
  const map = useRef<MapView>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [buttonMsg, setButtonMsg] = useState("hello");
  const [campsiteMarkers, setCampsiteMarkers] = useState<any[]>([]);
  const camera: any = {
    center: {
      latitude: location[0],
      longitude: location[1]
    },
    altitude: 10, 
    pitch: 90, 
    heading: 0,
    zoom: 100
  };
  let timeout!: number;
  useEffect(() => {
    global.THREE = global.THREE || THREE;
    return () => clearTimeout(timeout);
  }, []);

  const debugMode = false;
  
  // load random campsites near arrowhead
  useEffect(() => {
    setCampsiteMarkers(Array.from({length: 30}, (_, i) => { 
        return { num: i, latitude: location[0] + Math.random()/500, longitude: location[1] + Math.random()/500 }
    }));
  }, [])

  const moveUp = () => {
    setLocation([location[0], location[1] + 0.00001]);
  }

  useEffect(() => {
    if (mapLoaded) {
      if (map.current && location) {
        map.current.animateCamera({
          center: {
            latitude: location[0],
            longitude: location[1],
          },
          altitude: 0.001, 
          pitch: 90, 
          heading: 0,
          zoom: 20
        }, { duration: 700 });
      }
    }
  }, [mapLoaded, location])

  const storage: Camera = {
    pitch: 0,
    zoom: 0,
    heading: 0,
    altitude: 0,
    center: {
      latitude: 0,
      longitude: 0
    }
  }
  const appState = useRef(storage);

  const onMapPress = async () => {
    if (map.current) {
      let camera: Camera = await map.current.getCamera();
      appState.current = camera;
    }
  }

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
          {campsiteMarkers.map(obj => <MapCampsiteMarker key={obj.num} num={obj.num} latitude={obj.latitude} longitude={obj.longitude} />)}
        </MapView>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      { errorMsg ? <Text>{errorMsg}</Text> : null }
      <Button title={"LIVE MODE:" + buttonMsg} onPress={moveUp}></Button>
      <View style={styles.overlay} pointerEvents={'none'}>
        <GLView
          style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height }}
          onContextCreate={async (gl: ExpoWebGLRenderingContext) => {
            const renderer = new ExpoTHREE.Renderer({ gl });
            renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
            const _scene = new THREE.Scene(); 
            const sceneColor = 0x6ad6f0;
            _scene.fog = new THREE.Fog(sceneColor, 1, 10000);
            _scene.add(new THREE.GridHelper(10, 10));
            
            // load model
            const model = {
              'robot.glb': require('../../../../assets/models/robot.glb')
            };

            const gltf = await ExpoTHREE.loadAsync(model['robot.glb']);
            const object = gltf.scene;
            ExpoTHREE.utils.scaleLongestSideToSize(object, 3);
            _scene.add(object);

            const _camera = new THREE.PerspectiveCamera(75, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 1000);   
            _camera.position.y = 10;
            _camera.position.z = 0;
            _camera.lookAt(object.position);
  
            const light = new THREE.DirectionalLight(0xFFFFFF, 1);
            light.position.y = 3;
            light.position.z = 5;
            _scene.add(light);

            const render = () => {
              timeout = requestAnimationFrame(render);
              if (appState.current) {
                let r = Math.max(20 - appState.current.zoom, 0) * 10;
                let theta = THREE.MathUtils.degToRad(appState.current.pitch);
                let phi = THREE.MathUtils.degToRad(appState.current.heading);
                // basic trig to get camera position
                _camera.position.set(r * Math.sin(theta) * Math.cos(phi), r * Math.cos(theta), r * Math.sin(theta) * Math.sin(phi));
              } else {
                _camera.position.set(0, 10, 0);
              }
              _camera.lookAt(object.position);
              setButtonMsg("camera1 " + appState.current.heading);
              
              renderer.render(_scene, _camera);
              gl.endFrameEXP();
            };
            render();
          }}
        />
      </View>
      <MapView 
        showsBuildings={true}
        ref={map}
        style={styles.map} 
        provider={PROVIDER_GOOGLE}
        mapType={"standard"}
        camera={camera}
        showsUserLocation={true}
        followsUserLocation={true}
        showsCompass={false}
        scrollEnabled={false} // for ios
        zoomTapEnabled={false}
        toolbarEnabled={false} // for disabling on android
        onPress={onMapPress}
        onPanDrag={onMapPress}
        onMapLoaded={() => setMapLoaded(true)}
        customMapStyle={mapStyle}
        scrollDuringRotateOrZoomEnabled={false}
        loadingIndicatorColor={"#606060"}
        loadingBackgroundColor={"#FFFFFF"}
        minZoomLevel={15}
        maxZoomLevel={18}
      >
        {campsiteMarkers.map(obj => <MapCampsiteMarker key={obj.num} num={obj.num} latitude={obj.latitude} longitude={obj.longitude} />)}
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
  overlay: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 2
  }
});

export default MapScreen;