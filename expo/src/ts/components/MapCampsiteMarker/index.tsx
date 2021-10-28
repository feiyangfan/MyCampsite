import React, {useState} from 'react';
import {View, Text, Image} from 'react-native';
import {Marker} from 'react-native-maps';


const MapCampsiteMarker = (props: any) => {
    if (props.site) {
        const { name, location, _id } = props.site;
        return (<Marker 
            coordinate={{ latitude: location.latitude, longitude: location.longitude }} 
            onPress={() => props.moveToGuestbook(_id, name)}>
                <View style={{backgroundColor: "#E2C275ED", padding: 5, width: 130, height: 130, borderRadius: 20, borderColor: 'white', borderWidth: 2,
                    justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 15, color: 'black', fontWeight: 'bold'}}>{name}</Text>
                    <Image source={require('./favicon.png')} style={{height: 100, width:100, margin: 'auto', backgroundColor: '#AFE2C275', borderRadius: 20}} />
                </View>
            </Marker>);
    }
    return null;
}

export default MapCampsiteMarker;