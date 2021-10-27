import React from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import * as Types from "../../types";
import GuestbookList from "../../components/GuestbookList";
import {Button} from "react-native-elements"

const HomeScreen = ({ navigation }: Types.HomeScreenNavigationProp) => {
  // Dummy info for now; will update later to fetch information from database
  const locations = [
    {
      locationId: 0,
      locationName: "High Park",
      latitude: 43.65341893818677,
      longitude: -79.4651832778902,
    },
    {
      locationId: 1,
      locationName: "Big Bend Lookout",
      latitude: 45.38856286487596,
      longitude: -79.19198100228678,
    },
  ];

  const allPosts = [
    // Location 0 posts
    [
      {
        postId: 0,
        postLocation: "High Park",
        date: "2021/10/22",
        content: "I love the park",
      },
      {
        postId: 1,
        postLocation: "High Park",
        date: "2021/11/02",
        content: "Wooooooooo",
      },
    ],
    // Location 1 posts
    [
      {
        postId: 2,
        postLocation: "Big Bend Lookout",
        date: "2022/09/01",
        content: "The view here is incredible!",
      },
      {
        postId: 3,
        postLocation: "Big Bend Lookout",
        date: "2023/08/17",
        content: "Insert picture here",
      },
    ],
  ];

  // Navigate to the guestbook screen for the specified location
  // TODO: Change this function when database is connected
  const onGuestbookSelect = (locationId: any, locationName: String) => {
    navigation.navigate("Guestbook", {
      locationId: locationId,
      locationName: locationName,
      posts: allPosts[locationId],
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Guestbooks near you:</Text>
      <GuestbookList
        locations={locations}
        onGuestbookSelect={onGuestbookSelect}
      />
      <View style={styles.btnWrapper}>
      <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.navigate("Record")}
        >
          <Text style={styles.btnText}>Go to Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.navigate("Map")}
        >
          <Text style={styles.btnText}>Go to Map</Text>
        </TouchableOpacity>
      </View>
      <Button title="Me" onPress={() => navigation.navigate("Me")} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#334257",
    color: "white",
    height: "100%",
    flexDirection: "column",
    justifyContent: "space-evenly",
  },
  text: {
    fontSize: 20,
    textAlign: "center",
    color: "white",
  },
  btnWrapper: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  btnText: {
    textAlign: "center",
    color: "white",
    fontSize: 20,
  },
  btn: {
    backgroundColor: "grey",
    borderWidth: 1,
    borderRadius: 10,
    padding: 7,
    width: "50%",
  },
});

export default HomeScreen;
