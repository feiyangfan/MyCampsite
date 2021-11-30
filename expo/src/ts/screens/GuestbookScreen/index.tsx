import React, { useState } from "react";
import { Text, View, TouchableOpacity, StyleSheet, Image, FlatList, Alert } from "react-native";
import { Icon } from "react-native-elements";
import * as Types from "../../types";
const locationURL = "http://mycampsite-team12-d3.herokuapp.com/location";

const isAdmin = true; // Temporary

const GuestbookScreen = ({ route, navigation }: Types.GuestbookScreenNavigationProp) => {
  const { parkId, locationId, locationName } = route.params;

  // dummy posts for testing UI
  const posts = [
    {
      postId: 0,
      date: "Sep 30\n2021",
      locationId: 1,
      locationName: "Test Site",
      weather: { temp: 20, condition: "Clear" },
      notes: "Here's my post!",
      url: null,
      userId: 1,
    },
    {
      postId: 1,
      date: "Nov 20\n2021",
      locationId: 1,
      locationName: "Test Site",
      weather: { temp: 20, condition: "Rainy" },
      notes: "Here's another post!",
      url: null,
      userId: 1,
    },
    {
      postId: 3,
      date: "Nov 20\n2021",
      locationId: 1,
      locationName: "Test Site",
      weather: { temp: 20, condition: "Rainy" },
      notes: "Here's another post!",
      url: null,
      userId: 1,
    },
    {
      postId: 4,
      date: "Nov 20\n2021",
      locationId: 1,
      locationName: "Test Site",
      weather: { temp: 20, condition: "Rainy" },
      notes: "Here's another post!",
      url: null,
      userId: 1,
    },
  ];

  const showConfirmDialog = () => {
    return Alert.alert("Delete site", "Are you sure you want to delete this site?", [
      {
        text: "Yes",
        onPress: () => {
          deleteSite(parkId, locationId);
          alert("Site deleted!");
        },
      },
      { text: "No" },
    ]);
  };

  const deleteSite = (parkId: any, locationId: any) => {
    try {
      fetch(`${locationURL}/${parkId}/site/${locationId}`, {
        method: "DELETE",
      });
    } catch (err) {
      alert("Failed to delete site");
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require("../../../../assets/images/lake.png")} style={{ width: "100%", height: 200 }} />
      <View style={styles.mainCard}>
        <Text style={styles.text}>{locationName} Guestbook</Text>

        <View style={styles.addPost}>
          <Icon
            name="add-circle"
            color="#fff"
            size={40}
            style={{ paddingRight: 10 }}
            onPress={() => navigation.navigate("NewEntry", { parkId: parkId, locationId: locationId, locationName: locationName, source: "" })}
          />
          <Text style={styles.text}>Add an Entry</Text>
        </View>
        <View style={styles.listContainer}>
          <FlatList
            data={posts}
            keyExtractor={(item) => item.postId.toString()}
            renderItem={({ item }) => (
              <View>
                <TouchableOpacity style={styles.postThumbnail} onPress={() => navigation.navigate("Post", { post: item })}>
                  <Text style={styles.btnText}>{item.date}</Text>
                </TouchableOpacity>
              </View>
            )}
            numColumns={3}
          />
        </View>

        {isAdmin && (
          <View style={styles.deleteSite}>
            <Icon name="remove-circle-outline" color="red" size={30} style={{ paddingRight: 10 }} onPress={showConfirmDialog} />
            <Text style={styles.text}>Delete this site</Text>
          </View>
        )}
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
    fontSize: 30,
    textAlign: "center",
    color: "white",
  },
  listContainer: {
    alignItems: "center",
    flex: 1,
  },
  postThumbnail: {
    width: 115,
    height: 115,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#00AB67",
    borderRadius: 10,
    margin: 7,
  },
  addPost: { flexDirection: "row", justifyContent: "center", alignItems: "center", padding: 10 },
  deleteSite: { flexDirection: "row", justifyContent: "center", alignItems: "center", padding: 10 },
  btnText: {
    textAlign: "center",
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    textShadowColor: "gray",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
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
});

export default GuestbookScreen;
