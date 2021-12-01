import React, {useState, useRef, useEffect} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import MapView, {Camera, PROVIDER_GOOGLE}  from 'react-native-maps';
import {Text} from "react-native-elements";
import * as Location from 'expo-location';
import * as Types from '../../types';
import MapCampsiteMarker from '../../components/MapCampsiteMarker';
import mapStyle from '../../lib/map_style';
import {ExpoWebGLRenderingContext, GLView} from 'expo-gl';
import ExpoTHREE, {THREE} from 'expo-three';
import {fetch} from '../../lib/api';
import * as geolib from 'geolib';

const MapScreen = ({ route, navigation }: Types.MapScreenNavigationProp) => {
  const { ignoreDeviceLocation } = route.params;
  // map state
  const [location, setLocation] = useState<number[]>([45.39174144302487, -79.21459743503355]);
  const map = useRef<MapView>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [park, setPark] = useState<any>({});
  const camera: any = {
    pitch: 89.999,
    zoom: 19,
    heading: 0,
    altitude: 0.001,
    center: {
      latitude: location[0],
      longitude: location[1]
    }
  };
  const [tooFarAway, setTooFarAway] = useState(false);
  useEffect(() => {
    if (tooFarAway) {
      setTimeout(() => setTooFarAway(false), 3000);
    }
  }, [tooFarAway]);

  // initialize three
  let timeout!: number;
  useEffect(() => {
    global.THREE = global.THREE || THREE;
    return () => clearTimeout(timeout);
  }, []);

  const trackingDefault = {tracking: false, id: null};
  const trackingLocation = useRef<any>(trackingDefault);
  const [loading, setLoading] = useState(!ignoreDeviceLocation);
  const track = async () => {
    if (trackingLocation.current.tracking) {
      let location = await Location.getCurrentPositionAsync({});
      setLocation([location.coords.latitude, location.coords.longitude])
      setLoading(false);
    }
  }
  const trackLocationOn = async () => {  
    trackingLocation.current.tracking = true;
    await track();
    let id = setInterval(async () => {
      await track();
    }, 5000); 
    trackingLocation.current.id = id;
  }

  const trackLocationOff = () => {
    if (trackingLocation.current.id != null) {
      clearInterval(trackingLocation.current.id);
    }
    trackingLocation.current = trackingDefault;
  }

  // set location on start
  useEffect(() => {
    (async () => {
      let latitude = 0;
      let longitude = 0;
      if (ignoreDeviceLocation) {
        // Pre-defined location: Arrowhead Provincial Park
        latitude = 45.39174144302487;
        longitude = -79.21459743503355;
        setLocation([latitude, longitude]);
      } else {
        // Tracking device location
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          return;
        }
        trackLocationOn();
      }

      fetch('/location')
        .then(res => res.json())
        .then(data => { 
          const currentPark = data.filter((currentPark: any) => {
            const inLatitude =
              (latitude >= currentPark.boundary.latitudeStart && latitude <= currentPark.boundary.latitudeEnd) ||
              (latitude <= currentPark.boundary.latitudeStart && latitude >= currentPark.boundary.latitudeEnd);
            const inLongitude =
              (longitude >= currentPark.boundary.longitudeStart && longitude <= currentPark.boundary.longitudeEnd) ||
              (longitude <= currentPark.boundary.longitudeStart && longitude >= currentPark.boundary.longitudeEnd);

            return inLatitude && inLongitude;
          });
          
          if (currentPark.length === 0) {
            fetch("/location/0/unknown")
              .then((response) => response.json())
              .then((data) => {
                setPark(data);
              });
          } else {
            if (currentPark.length > 0) {
              setPark(currentPark[0]);
            } else {
              setPark({});
            }
          }
        })
    })();
    return () => {
      if (!ignoreDeviceLocation) {
        trackLocationOff();
      }
    };
  }, []);

  // Return true if the user is in range of a given site (or site is on spotlight), false otherwise.
  const siteInRange = (site: any) => {
    if (site.location.radius < 0) return true;
    const distance = geolib.getPreciseDistance(
      { latitude: site.location.latitude, longitude: site.location.longitude },
      { latitude: location[0], longitude: location[1] }
    );
    const inRange = site.location.radius >= distance;
    return inRange;
  };

  const moveToGuestbook = (parkId: any, siteId: any, siteName: string) => {
    navigation.navigate('Guestbook', { 
      parkId: parkId,
      locationId: siteId,
      locationName: siteName,
    });
  }

  // set position on location change or when map is loaded
  useEffect(() => {
    if (mapLoaded) {
      if (map.current && location) {
        if (ignoreDeviceLocation) {
          map.current.animateCamera( 
            {
              center: {
                latitude: location[0],
                longitude: location[1],
              },
              altitude: appState.current.camera.altitude, 
              pitch: appState.current.camera.pitch, 
              heading: appState.current.camera.heading,
              zoom: appState.current.camera.zoom
            }
          , { duration: 700 }); 
        } 
        // no animation in live mode, otherwise map will animate every 5 seconds
        else {
          map.current.setCamera({
            center: {
              latitude: location[0],
              longitude: location[1],
            },
            altitude: appState.current.camera.altitude, 
            pitch: appState.current.camera.pitch, 
            heading: appState.current.camera.heading,
            zoom: appState.current.camera.zoom
          });
        }
        onMapPress();
      }
    } 
  }, [mapLoaded, location])

  const appState = useRef({
    camera: {
      pitch: 89.999,
      zoom: 19,
      heading: 0,
      altitude: 0.001,
      center: {
        latitude: location[0],
        longitude: location[1]
      }
    },
    user: {
      heading: 0
    }
  });

  // store camera state on map press
  const onMapPress = async () => {
    if (map.current) {
      let camera: Camera = await map.current.getCamera();
      appState.current.camera = camera;
    }
  }

  return (
    <View style={styles.container} pointerEvents={loading ? 'none' : 'auto'}>
      { mapLoaded ?  <View style={{position: 'absolute', top: 100, left: 0, zIndex: 2, width: '100%', alignItems: 'center'}}>
        <View>
          <View style={{backgroundColor: '#00AB67', padding: 10}}>
            <Text h3 h3Style={{color: 'white', textAlign: 'center', fontWeight: 'bold'  }}>{ignoreDeviceLocation ? 'Demo' : 'Live'} Mode</Text> 
          </View>
          { ignoreDeviceLocation ? 
          <View style={{backgroundColor: '#86C496AC', padding: 10}}>
          <Text h4 h4Style={{color: 'white', textAlign: 'center', marginBottom: 10, fontSize: 16, fontWeight: 'bold'  }}>In demo mode, your location is fixed at Arrowhead Provincial Park.</Text>
          <Text h4 h4Style={{color: 'white', textAlign: 'center', marginBottom: 10, fontSize: 14, fontWeight: 'bold'  }}>• You may click on the Entrance Site to view its Guestbook.</Text>
          <Text h4 h4Style={{color: 'white', textAlign: 'center', marginBottom: 20, fontSize: 14, fontWeight: 'bold'  }}>• You may rotate or tilt the map to view your surroundings.</Text>
          </View> :
          <View style={{backgroundColor: '#86C496AC', padding: 10}}>
            <Text h4 h4Style={{color: 'white', textAlign: 'center', marginBottom: 10, fontSize: 16, fontWeight: 'bold' }}>In live mode, your location is tracked from your device.</Text>
            <Text h4 h4Style={{color: 'white', textAlign: 'center', marginBottom: 10, fontSize: 14, fontWeight: 'bold'  }}>• You may visit Arrowhead Provincinal Park to view the Guestbooks.</Text>
            <Text h4 h4Style={{color: 'white', textAlign: 'center', marginBottom: 10, fontSize: 14, fontWeight: 'bold'  }}>• You may rotate or tilt the map to view your surroundings.</Text>
            <Text h4 h4Style={{color: 'white', textAlign: 'center', marginBottom: 20, fontSize: 14, fontWeight: 'bold'  }}>• You may walk around to move your robot character.</Text>
          </View>
          }
        </View>
      </View> : null }
      { mapLoaded ?  
        <View style={{position: 'absolute', top: 50, left: 0, width: '100%', alignItems: 'center', zIndex: 2}}>
          <View style={{}}>
            <View style={{backgroundColor: '#00AB67', padding: 10}}>
              <Text h4 h4Style={{color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 14}}>Location: {loading ? 'Loading...' : (Object.keys(park).length === 0  ? 'Unknown' : park.name)}</Text> 
            </View>
          </View>
        </View> : null }
        { mapLoaded && tooFarAway ?  
        <View style={{position: 'absolute', bottom: 50, left: 0, width: '100%', alignItems: 'center', zIndex: 2}}>
          <View style={{}}>
            <View style={{backgroundColor: '#00AB67', padding: 10}}>
              <Text h4 h4Style={{color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 14}}>You are too far away!</Text> 
            </View>
          </View>
        </View> : null }
      <View style={styles.overlay} pointerEvents={'none'}>
        <GLView
          style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height }}
          onContextCreate={async (gl: ExpoWebGLRenderingContext) => {
            const renderer = new ExpoTHREE.Renderer({ gl });
            renderer.setSize(gl.drawingBufferWidth, gl.drawingBufferHeight);
            const _scene = new THREE.Scene(); 
            
            // load model
            const model = {
              'robot.glb': require('../../../../assets/models/robot.glb')
            };

            const gltf = await ExpoTHREE.loadAsync(model['robot.glb']);
            const object = gltf.scene;
            ExpoTHREE.utils.scaleLongestSideToSize(object, 4);
            object.position.set(0, -10, 0);
            _scene.add(object);

            const _camera = new THREE.PerspectiveCamera(75, gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 1000);   
            _camera.position.y = 10;
            _camera.position.z = 0;
            _camera.lookAt(object.position);
  
            const light = new THREE.DirectionalLight(0xFFFFFF, 1);
            light.position.y = 10;
            light.position.z = 5;
            _scene.add(light);

            // const yaxis = new THREE.Vector3(0, 1, 0);

            const render = () => {
              timeout = requestAnimationFrame(render);
              if (appState.current) {
                let r = Math.max(20 - appState.current.camera.zoom, 0) * 15;
                // add fractional pitch when zero to prevent gimbal lock
                let theta = THREE.MathUtils.degToRad(appState.current.camera.pitch + (appState.current.camera.pitch === 0 ? .0001 : 0));
                let phi = THREE.MathUtils.degToRad(appState.current.camera.heading);
                // basic trig to get camera position
                _camera.position.set(r * Math.sin(theta) * Math.cos(phi), r * Math.cos(theta), r * Math.sin(theta) * Math.sin(phi));
                // set object to match DeviceMotion heading
                // object.setRotationFromAxisAngle(yaxis, appState.current.user.heading);
                _camera.lookAt(object.position); 
              }
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
        camera={appState.current ? appState.current.camera : camera}
        showsUserLocation={false} // no need for blue location dot - we have mister robot :D
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
        maxZoomLevel={19}
      >
        {park?.sites?.map((site: any) => <MapCampsiteMarker key={site.name} site={site} moveToGuestbook={(siteId: any, siteName: string) => moveToGuestbook(park._id, siteId, siteName)} siteInRange={() => siteInRange(site)} setTooFarAway={setTooFarAway}/>)}
      </MapView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#EFEFEF',
    height: '100%',
    alignSelf: 'stretch', 
    textAlign: 'center'
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