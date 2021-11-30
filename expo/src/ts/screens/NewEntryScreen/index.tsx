import { signInWithRedirect } from "@firebase/auth";
import React, { useState } from "react";
import { View, ScrollView, Text, StyleSheet, TextInput } from "react-native";
import { Icon } from "react-native-elements";
import { Button } from "react-native-elements";
import * as Types from "../../types";
// import { fetch } from "../../lib/api";

const NewEntryScreen = ({ route, navigation }: Types.NewEntryScreenNavigationProp) => {
  const postURL = "http://mycampsite-team12-d3.herokuapp.com/post";

  const [notes, setNotes] = useState("");

  const createPost = () => {
    try {
      fetch(`${postURL}/post`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ siteId: route.params.locationId, notes: notes }),
      }).then((response) => {
        alert("Post submitted!");
        navigation.navigate("Guestbook", {
          parkId: route.params.parkId,
          locationId: route.params.locationId,
          locationName: route.params.locationName,
        });
      });
    } catch (err) {
      alert("Post failed");
    }
  };

  return (
    <View style={{ backgroundColor: "#005131" }}>
      <ScrollView keyboardShouldPersistTaps="never" contentContainerStyle={styles.container}>
        <Text style={styles.header}> {route.params.locationName} Guestbook </Text>
        <Text style={styles.text}> Create entry: </Text>
        <View style={styles.iconContainer}>
          <Icon name="video-call" iconStyle={styles.icon} size={50} onPress={() => navigation.navigate("Record")} />
          <Icon name="add-a-photo" iconStyle={styles.icon} size={50} />
          <Icon name="mic" iconStyle={styles.icon} size={50} />
        </View>
        <Text style={styles.text}> Write a message instead: </Text>
        <TextInput multiline style={styles.input} placeholder={"Notes"} value={notes} onChangeText={(notes) => setNotes(notes)} />
        <Button buttonStyle={styles.submitBtn} title="Submit Text Entry" onPress={createPost} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    margin: 15,
    fontSize: 30,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  container: {
    backgroundColor: "#005131",
    color: "white",
    height: "100%",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    padding: 15,
  },
  button: {
    width: 200,
    backgroundColor: "#00AB67",
    margin: 15,
  },
  submitBtn: {
    width: 200,
    backgroundColor: "#00AB67",
    margin: 15,
  },
  input: {
    backgroundColor: "#fff",
    width: "85%",
    height: 120,
    fontSize: 20,
    margin: 15,
    padding: 10,
  },
  text: {
    fontSize: 24,
    textAlign: "left",
    color: "white",
  },
  iconContainer: {
    flexDirection: "row",
    marginBottom: 30,
  },
  icon: {
    color: "white",
    margin: 15,
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 5,
    padding: 8,
  },
});

export default NewEntryScreen;
