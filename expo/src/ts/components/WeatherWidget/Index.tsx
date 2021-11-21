import React from "react"
import { Fontisto } from "@expo/vector-icons";

const background_colors = {
    'Clear': "#00cec9", 
    'Rain': "#0984e9", 
    'Clouds': "#868686", 
    'Snow': "#FEFEFE", 
    "Atmosphere": "#2d3436"
}

const API_KEY = 123
const handleGetWeather = async (lat?: string, long?: string) => {
      const data = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&exclude=alerts&appid=${API_KEY}&units=metric`);
      const data_json = await data.json();
      const weather = data_json.weather.main;
      const temp = Math.ceil(data_json.main.temp)
      return {'temp': temp, 'weather': weather}
};

const WeatherWidget = (props: {lat?: string, long?: string}) => {
    const data = handleGetWeather(props.lat, props.long)
    

}

export default WeatherWidget