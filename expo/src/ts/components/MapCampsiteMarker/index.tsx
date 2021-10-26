import React, {useState} from 'react';
import {View, Text, Image} from 'react-native';
import {Marker} from 'react-native-maps';


const MapCampsiteMarker = (props: any) => {
    const [clicked, setClicked] = useState(false);
    if (props.latitude && props.longitude) {
      return (<Marker 
        coordinate={{ latitude: props.latitude, longitude: props.longitude }} 
        // image={{width: 150, height: 150, uri: "https://picsum.photos/150"}}
        onPress={() => setClicked(true)}>
            <View style={{backgroundColor: "#E2C275ED", padding: 5, width: 130, height: 130, borderRadius: 20, borderColor: 'white', borderWidth: 2,
                 justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{fontSize: 14, color: 'white', fontWeight: 'bold'}}>Site {props.num}</Text>
                <Image source={require('./favicon.png')} style={{height: 100, width:100, margin: 'auto', backgroundColor: '#AFE2C275', borderRadius: 20}} />
            </View>
        </Marker>);
    }
    return null;
}

export default MapCampsiteMarker;