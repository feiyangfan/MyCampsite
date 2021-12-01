import React from "react"
import {View, Text, StyleSheet} from "react-native"
import { Fontisto } from "@expo/vector-icons";


const background_colors: {[key: string]: string} = {
    'Clear': "#0095ff", 
    'Rain': "#6b95ff", 
    'Clouds': "#868686", 
    'Snow': "#FEFEFE", 
    "Thunderstorm": "#6b95ff",
    "Drizzle": "#6b95ff",
    "Atmosphere": "#2d3436",
    // extra atmospheric conditions
    "Mist": "#2d3436",
    "Smoke": "#2d3436",
    "Haze": "#2d3436",
    "Dust": "#2d3436",
    "Fog": "#2d3436",
    "Sand": "#2d3436",
    "Ash": "#2d3436",
    "Squall": "#2d3436",
    "Tornado": "#2d3436"
}


const icons: {[key: string]: keyof typeof Fontisto.glyphMap} = {
    Clear: "day-sunny",
    Rain: "rains",
    Clouds: "cloudy",
    Snow: "snow",
    Thunderstorm: "lightnings",
    Atmosphere: "cloudy",
    // extra atmospheric conditions
    Mist: "rain",
    Smoke: "fog",
    Haze: "fog",
    Dust: "fog",
    Fog: "fog",
    Sand: "fog",
    Ash: "fog",
    Squall: "fog",
    Tornado: "wind"
  };


const WeatherWidget = (props: {temp: number, condition: string}) => {
    // get corresponding icon and background color
    const bg_colors = background_colors[props.condition]
    const temp = Math.ceil(props.temp)
    // return component
    return (
        <View style={[styles.container, {backgroundColor: bg_colors}]}>
            <Text style={styles.tempText}>{temp}°</Text>
            <Fontisto
                name={icons[props.condition]}
                size={30}
                color="white"
            />
        </View>
      );

}

const styles = StyleSheet.create({
    container: {
        width: "37%",
        padding: 7, // can be changed
        backgroundColor: "#2d3436",
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: "center"
    },
    tempText: {
        paddingRight: 10,// can be changed
        color: '#ffffff',
        fontSize: 20,
        fontWeight: 'bold',
    },
  });

export default WeatherWidget