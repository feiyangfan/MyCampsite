import React, { useState, useEffect } from "react";
import { Text, View, ScrollView, StyleSheet, Image, ActivityIndicator } from "react-native";
import { Button } from "react-native-elements";
import * as Location from "expo-location";
import * as geolib from "geolib";
import { fetch } from "../../lib/api";

import * as Types from "../../types";
import GuestbookList from "../../components/GuestbookList";
import Spotlight from "../../components/Spotlight";

const HomeScreen = ({ navigation }: Types.HomeScreenNavigationProp) => {
  const [nearbySites, setNearbySites] = useState<any[]>([]);
  const [allSites, setAllSites] = useState<any[]>([]);
  const [userLocation, setUserLocation] = useState<number[]>([]);
  const [nearestParkId, setNearestParkId] = useState("");
  const [subscription, setSubscription] = useState<any>();
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setLoading] = useState(true);

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

    fetch("/location")
      .then((response) => response.json())
      .then((data) => (parks = data))
      .then(() => determineCurrentPark(location, parks))
      .then(() => setLoading(false));
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
    if (parkArray.length === 0) {
      //Get ID of "Unknown" park
      fetch("/location/unknown")
        .then((response) => response.json())
        .then((data) => setNearestParkId(data._id));
    } else {
      setNearestParkId(parkArray[0]._id);
    }

    // Store sites from current list of parks (in case there is more than one):
    const sites: any[] = [];
    parkArray.map((park) => sites.push(...park.sites));
    setAllSites(sites);
  };

  const updateSiteList = (parkId: any) => {};

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
  const onGuestbookSelect = (parkId: any, locationId: any, locationName: string) => {
    navigation.navigate("Guestbook", {
      parkId: parkId,
      locationId: locationId,
      locationName: locationName,
    });
  };
  // for testing
  const sites = [
    {
      _id: "1",
      name: "Stubb's Falls",
      location: "1, 1",
      spotlight: true,
      image: "https://www.linkpicture.com/q/1_1485.jpg",
    },
    {
      _id: "2",
      name: "site 2",
      location: "2, 2",
      spotlight: false,
    },
    {
      _id: "3",
      name: "Big Bend Lookout",
      location: "3, 3",
      spotlight: true,
      image: "https://www.linkpicture.com/q/bigbend.jpg",
    },
    {
      _id: "4",
      name: "site 4",
      location: "4, 4",
      spotlight: false,
    },
    {
      _id: "5",
      name: "Arrowhead Skating Trail",
      location: "5, 5",
      spotlight: true,
      image: "https://www.linkpicture.com/q/arrow_1.jpg",
    },
  ];
  // const sites = []

  return (
    <View style={styles.container}>
      <Image source={require("../../../../assets/images/lake.png")} style={styles.image} />
      <ScrollView style={{ backgroundColor: "transparent", height: "100%" }} nestedScrollEnabled={true}>
        <View style={styles.mainCard}>
          <Text style={styles.text}>Guestbooks near you:</Text>
          {isLoading ? (
            <ActivityIndicator style={styles.loading} />
          ) : (
            <GuestbookList parkId={nearestParkId} locations={nearbySites} onGuestbookSelect={onGuestbookSelect} />
          )}
          <Text style={styles.text}>Spotlight:</Text>
          <Spotlight parkId={nearestParkId} sites={sites} onSpotlightSelect={onGuestbookSelect} />
          <View style={styles.buttonWrapper}>
            <Button buttonStyle={styles.button} title="View Map (Demo)" onPress={() => navigation.navigate("Map", { ignoreDeviceLocation: true })} />
            <Button buttonStyle={styles.button} title="View Map (Live)" onPress={() => navigation.navigate("Map", { ignoreDeviceLocation: false })} />
            <Button
              buttonStyle={styles.button}
              title="Add New Site"
              onPress={() =>
                navigation.navigate("AddSite", {
                  location: userLocation,
                  parkId: nearestParkId,
                })
              }
            />
            <Button buttonStyle={styles.button} title="My Account" onPress={() => navigation.navigate("Me")} />
          </View>
        </View>
      </ScrollView>
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
  image: {
    width: "100%",
    height: 200,
    position: "absolute",
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
    flex: 1,
    position: "relative",
    top: 170,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 10,
    height: 1000,
  },
  buttonWrapper: {
    alignItems: "center",
  },
  button: {
    margin: 15,
    width: 200,
    backgroundColor: "#00AB67",
  },
  loading: {
    marginTop: 20,
  },
});

export default HomeScreen;
