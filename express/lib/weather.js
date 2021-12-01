import fetch from "node-fetch";
import {weatherBaseURL, weatherAPIKey} from "./config.js";

const fetchWeather = (site) => {
    const url = new URL(`${weatherBaseURL}/weather`);
    url.search = new URLSearchParams({
        lat: site.location.latitude,
        lon: site.location.longitude,
        appid: weatherAPIKey
    });
    return fetch(url).then(res => res.json());
};
