import React, {useState} from 'react';
import {Marker} from 'react-native-maps';


const MapCampsiteMarker = (props: any) => {
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

export default MapCampsiteMarker;