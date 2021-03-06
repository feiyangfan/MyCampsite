import React, { useState, useEffect } from "react";
import { Text, View, ScrollView, StyleSheet, Image, ActivityIndicator } from "react-native";
import { Button } from "react-native-elements";
import * as Location from "expo-location";
import * as geolib from "geolib";
import { fetch } from "../../lib/api";
import * as Types from "../../types";
import GuestbookList from "../../components/GuestbookList";
import Spotlight from "../../components/Spotlight";

const HomeScreen = ({ route, navigation }: Types.HomeScreenNavigationProp) => {
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
      const locationArray = [location.coords.latitude, location.coords.longitude];
      setUserLocation(locationArray);
      initializeSiteList(locationArray);

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
  const initializeSiteList = (locationArray: number[]) => {
    // Fetch parks list
    let parks: any[] = [];

    fetch("/location")
      .then((response) => response.json())
      .then((data) => (parks = data))
      .then(() => determineCurrentPark(locationArray, parks))
      .then(() => setLoading(false));
  };

  // Determine which park a user is in, if any, and set the sites to check based on park
  const determineCurrentPark = (locationArray: number[], parks: any[]) => {
    // Should be updated to use mongoDB's search by geoindex feature
    const latitude = locationArray[0];
    const longitude = locationArray[1];
    const parkArray = parks.filter((currentPark) => {
      const inLatitude =
        (latitude >= currentPark.boundary.latitudeStart && latitude <= currentPark.boundary.latitudeEnd) ||
        (latitude <= currentPark.boundary.latitudeStart && latitude >= currentPark.boundary.latitudeEnd);
      const inLongitude =
        (longitude >= currentPark.boundary.longitudeStart && longitude <= currentPark.boundary.longitudeEnd) ||
        (longitude <= currentPark.boundary.longitudeStart && longitude >= currentPark.boundary.longitudeEnd);

      return inLatitude && inLongitude;
    });

    // Store nearest park
    if (parkArray.length === 0) {
      // Get ID of "Unknown" park
      fetch("/location/0/unknown")
        .then((response) => response.json())
        .then((data) => {
          setNearestParkId(data._id);
          setAllSites(data.sites);
        });
    } else {
      // Get ID of nearest park
      setNearestParkId(parkArray[0]._id);
      setAllSites(parkArray[0].sites);
    }
  };

  const updateSiteList = () => {
    const parkId = nearestParkId;
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
  const onGuestbookSelect = (parkId: any, locationId: any, locationName: string) => {
    navigation.navigate("Guestbook", {
      parkId: parkId,
      locationId: locationId,
      locationName: locationName,
    });
  };

  // Update all sites if site is deleted
  useEffect(() => {
    if (route.params?.deleteSite) {
      const filteredSites = allSites.filter((site) => site._id !== route.params.deleteSite);
      setAllSites(filteredSites);
      console.log("Nearby:", ...nearbySites);
      console.log("All:", ...allSites);
    }
  }, [route.params?.deleteSite]);

  // Update all sites if site is added
  useEffect(() => {
    if (route.params?.addSite) {
      const filteredSites = allSites.filter((site) => site._id !== route.params.addSite); // Prevent duplicate
      setAllSites([...filteredSites, route.params.addSite]);
    }
  }, [route.params?.addSite]);

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
          <Spotlight parkId={nearestParkId} sites={allSites} onSpotlightSelect={onGuestbookSelect} />
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
