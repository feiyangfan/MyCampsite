import React, { useState, useEffect } from "react";
import { Text, View, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Button } from "react-native-elements";
import * as Location from "expo-location";
import * as geolib from "geolib";

import * as Types from "../../types";
import GuestbookList from "../../components/GuestbookList";
import Spotlight from "../../components/Spotlight";

const HomeScreen = ({ navigation }: Types.HomeScreenNavigationProp) => {
  const locationURL = "http://mycampsite-team12-d3.herokuapp.com/location";
  const [nearbySites, setNearbySites] = useState<any[]>([]);
  const [allSites, setAllSites] = useState<any[]>([]);
  const [userLocation, setUserLocation] = useState<number[]>([]);
  const [nearestParkId, setNearestParkId] = useState();
  const [subscription, setSubscription] = useState<any>();
  const [errorMsg, setErrorMsg] = useState("");

  const backgroundImg = "../../../../assets/images/lake.png";

  // Get location permissions, watch user's location, and initialize list of sites
  useEffect(() => {
    (async () => {
      // Get location permissions
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      // Get initial location and determine current park
      const location = await Location.getCurrentPositionAsync();
      setUserLocation([location.coords.latitude, location.coords.longitude]);
      initializeSiteList(location);

      // Subscribe to location updates
      watchPosition();
    })();
  }, []);

  // Subscribe to position updates
  const watchPosition = async () => {
    const newSubscription = await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, timeInterval: 5000, distanceInterval: 0 },
      (location) => {
        setUserLocation([location.coords.latitude, location.coords.longitude]);
      }
    );
    setSubscription(newSubscription);
  };

  // Initialize list of all sites within any park the user is near
  const initializeSiteList = (location: { coords: { latitude: number; longitude: number } }) => {
    // Fetch parks list
    let parks: any[] = [];

    fetch(locationURL)
      .then((response) => response.json())
      .then((data) => (parks = data))
      .then(() => determineCurrentPark(location, parks));
  };

  // Determine which park a user is in, if any, and set the sites to check based on park
  const determineCurrentPark = (location: { coords: { latitude: number; longitude: number } }, parks: any[]) => {
    const parkArray = parks.filter((currentPark) => {
      const inLatitude =
        (location.coords.latitude >= currentPark.boundary.latitudeStart && location.coords.latitude <= currentPark.boundary.latitudeEnd) ||
        (location.coords.latitude <= currentPark.boundary.latitudeStart && location.coords.latitude >= currentPark.boundary.latitudeEnd);
      const inLongitude =
        (location.coords.longitude >= currentPark.boundary.longitudeStart && location.coords.longitude <= currentPark.boundary.longitudeEnd) ||
        (location.coords.longitude <= currentPark.boundary.longitudeStart && location.coords.longitude >= currentPark.boundary.longitudeEnd);

      return inLatitude && inLongitude;
    });

    // Store nearest park
    try {
      setNearestParkId(parkArray[0]._id);
    } catch (err) {}

    // Store sites from current list of parks (in case there is more than one):
    const sites: any[] = [];
    parkArray.map((park) => sites.push(...park.sites));
    setAllSites(sites);
  };

  // Return true if the user is in range of a given site, false otherwise.
  const siteInRange = (site: any) => {
    const distance = geolib.getPreciseDistance(
      { latitude: site.location.latitude, longitude: site.location.longitude },
      { latitude: userLocation[0], longitude: userLocation[1] }
    );
    const inRange = site.location.radius >= distance;
    return inRange;
  };

  // Update nearby sites list when user's location changes
  useEffect(() => {
    const newSites = allSites.filter((site) => siteInRange(site));
    setNearbySites(newSites);
  }, [userLocation]);

  // Navigate to the guestbook screen for the specified location
  // TODO: Change this function when database is connected
  const onGuestbookSelect = (locationId: any, locationName: String) => {
    navigation.navigate("Guestbook", {
      locationId: locationId,
      locationName: locationName,
      posts: [], //Update this to read posts from database
    });
  };

  return (
    <View style={styles.container}>
      <Image source={require("../../../../assets/images/lake.png")} style={{ width: "100%", height: 200 }} />
      <View style={styles.mainCard}>
        <Text style={styles.text}>Guestbooks near you:</Text>
        <GuestbookList locations={nearbySites} onGuestbookSelect={onGuestbookSelect} />
        <Text style={styles.text}>Spotlight:</Text>
        <Spotlight sites={allSites} onSpotlightSelect={onGuestbookSelect} />
        <View style={styles.loginWrapper}>
          <Button
            style={styles.loginBtn}
            buttonStyle={{ backgroundColor: "#00AB67" }}
            title="View Map (Demo)"
            onPress={() => navigation.navigate("Map", { ignoreDeviceLocation: true })}
          />
          <Button
            style={styles.loginBtn}
            buttonStyle={{ backgroundColor: "#00AB67" }}
            title="View Map (Live)"
            onPress={() => navigation.navigate("Map", { ignoreDeviceLocation: false })}
          />
          <Button
            style={styles.loginBtn}
            buttonStyle={{ backgroundColor: "#00AB67" }}
            title="Add New Site"
            onPress={() =>
              navigation.navigate("AddSite", {
                location: userLocation,
                parkId: nearestParkId,
              })
            }
          />
          <Button
            style={styles.loginBtn}
            buttonStyle={{ backgroundColor: "#00AB67" }}
            title="Add New Post"
            onPress={() => navigation.navigate("Record")}
          />
          <Button style={styles.loginBtn} buttonStyle={{ backgroundColor: "#00AB67" }} title="My Account" onPress={() => navigation.navigate("Me")} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#005131",
    color: "white",
    height: "100%",
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  text: {
    fontSize: 25,
    fontWeight: "bold",
    marginLeft: 10,
    marginTop: 40,
    textAlign: "left",
    color: "white",
  },
  mainCard: {
    backgroundColor: "#005131",
    color: "white",
    flexDirection: "column",
    height: 600,
    position: "relative",
    top: -20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 10,
  },
  loginWrapper: {
    alignItems: "center",
  },
  loginBtn: {
    marginTop: 15,
    width: 200,
  },
});

export default HomeScreen;
