import React from "react"
import {View, Text, StyleSheet} from "react-native"
import { Fontisto } from "@expo/vector-icons";


const background_colors: {[key: string]: string} = {
    'Clear': "#0095ff", 
    'Rainy': "#6b95ff", 
    'Cloudy': "#868686", 
    'Snowy': "#FEFEFE", 
    "Atmosphere": "#2d3436"
}


const icons: {[key: string]: keyof typeof Fontisto.glyphMap} = {
    Clear: "day-sunny",
    Cloudy: "cloudy",
    Rainy: "rain",
    Snowy: "snow",
    Atmosphere: "cloudy-gusts",
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