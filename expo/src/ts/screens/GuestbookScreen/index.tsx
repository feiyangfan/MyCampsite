import { typeAlias } from "@babel/types";
import React from "react";
import { Text, View, TouchableOpacity, StyleSheet, Image, FlatList } from "react-native";
import { Icon } from "react-native-elements";
import * as Types from "../../types";

const GuestbookScreen = ({ route, navigation }: Types.GuestbookScreenNavigationProp) => {
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
  const { locationId, locationName } = route.params;

  return (
    <View style={styles.container}>
      <Image source={require("../../../../assets/images/lake.png")} style={{ width: "100%", height: 200 }} />
      <View style={styles.mainCard}>
        <Text style={styles.text}>{locationName} Guestbook</Text>
        <View style={styles.addPost}>
          <Icon name="add-circle" color="#fff" size={40} style={{ paddingRight: 10 }} onPress={() => navigation.navigate("Record")} />
          <Text style={styles.text}>Add an Entry</Text>
        </View>
        <View style={styles.listContainer}>
          <FlatList
            data={posts}
            renderItem={({ item }) => (
              <View key={item.postId}>
                <TouchableOpacity style={styles.postThumbnail} onPress={() => navigation.navigate("Post", { post: item })}>
                  <Text style={styles.btnText}>{item.date}</Text>
                </TouchableOpacity>
              </View>
            )}
            numColumns={3}
          />
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
