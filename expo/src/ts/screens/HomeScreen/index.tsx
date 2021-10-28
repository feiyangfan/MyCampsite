import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import * as Types from '../../types';
import GuestbookList from '../../components/GuestbookList';
import { Button } from 'react-native-elements';
import * as Location from 'expo-location';
import * as geolib from 'geolib';
import { current } from '@reduxjs/toolkit';

const HomeScreen = ({ navigation }: Types.HomeScreenNavigationProp) => {
  const locationURL = 'http://mycampsite-team12.herokuapp.com/location';
  const [nearbySites, setNearbySites] = useState<any[]>([]);
  const [allSites, setAllSites] = useState<any[]>([]);
  const [userLocation, setUserLocation] = useState<number[]>([]);
  const [userParks, setUserParks] = useState<any[]>([]);
  const [subscription, setSubscription] = useState<any>();
  const [errorMsg, setErrorMsg] = useState('');

  // Get location permissions, watch user's location, and set current park
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      watchPosition();
    })();
  }, []);

  // Subscribe to position updates
  const watchPosition = async () => {
    const newSubscription = await Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, timeInterval: 5000, distanceInterval: 0 },
      (location) => {
        setUserLocation([location.coords.latitude, location.coords.longitude]);
        storeParksList(location);
      }
    );
    setSubscription(newSubscription);
  };

  // Set parks list once location subscription changes
  const storeParksList = (location: { coords: { latitude: number; longitude: number } }) => {
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
    setUserParks(parkArray);

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
    navigation.navigate('Guestbook', {
      locationId: locationId,
      locationName: locationName,
      posts: [], //Update this to read posts from database
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Guestbooks near you:</Text>
      <GuestbookList locations={nearbySites} onGuestbookSelect={onGuestbookSelect} />
      <View style={styles.btnWrapper}>
        <TouchableOpacity style={styles.btn} onPress={() => navigation.navigate('Map')}>
          <Text style={styles.btnText}>Go to Map</Text>
        </TouchableOpacity>
      </View>
      <Button title="Me" onPress={() => navigation.navigate('Me')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#334257',
    color: 'white',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
  },
  text: {
    fontSize: 20,
    textAlign: 'center',
    color: 'white',
  },
  btnWrapper: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 20,
  },
  btn: {
    backgroundColor: 'grey',
    borderWidth: 1,
    borderRadius: 10,
    padding: 7,
    width: '50%',
  },
});

export default HomeScreen;
