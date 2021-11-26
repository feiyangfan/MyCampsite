import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, TextInput } from "react-native";
import { Button, ButtonGroup } from "react-native-elements";
import * as Types from "../../types";

const AddSiteScreen = ({ route, navigation }: Types.AddSiteScreenNavigationProp) => {
  const { location, parkId } = route.params;
  const locationURL = "http://mycampsite-team12-d3.herokuapp.com/location";
  const [name, setName] = useState("");
  const [park, setPark] = useState("");
  const [radius, setRadius] = useState("");
  const [type, setType] = useState("Campsite");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const isAdmin = true; // For testing, give admin capability to all users. Must update later

  const buttons = ["Campsite", "Point of Interest"];

  // Get park name to suggest
  useEffect(() => {
    console.log(locationURL);
    fetch(`${locationURL}/${parkId}`)
      .then((data) => data.json())
      .then((park) => {
        park.name !== null ? setPark(park.name) : setPark("");
      })
      .catch((error) => console.log(error));
  }, []);

  // Attempt to find parkId based on user input
  const findPark = (parkName: String) => {}; //TODO

  const handleSelectType = (index: any) => {
    setSelectedIndex(index);
    if (index === 0) setType("campsite");
    else if (index === 1) setType("point of interest");
  };

  const handleAddSite = () => {
    try {
      fetch(`${locationURL}/${parkId}/site/`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          location: {
            latitude: location[0],
            longitude: location[1],
            radius: radius ? Number.parseInt(radius) : 200,
            type: type,
            spotlight: false,
          },
        }),
      });

      setName("");
      setRadius("");
      alert("Site added!");
    } catch (err) {
      console.log("Add site failed");
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add a new site at your current location:</Text>
      <View style={styles.fieldContainer}>
        <Text style={styles.text}> Park name: </Text>
        <TextInput style={styles.input} placeholder={"Park name"} value={park} onChangeText={(park) => setPark(park)} />
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.text}> Site name: </Text>
        <TextInput style={styles.input} placeholder={"Site name"} value={name} onChangeText={(name) => setName(name)} />
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.text}> Site type: </Text>
        <View style={styles.buttonsContainer}>
          <ButtonGroup
            onPress={handleSelectType.bind(this)}
            selectedIndex={selectedIndex}
            buttons={buttons}
            containerStyle={{ height: "100%", width: "100%", marginTop: 20 }}
            buttonContainerStyle={{ backgroundColor: "#00301D" }}
            selectedButtonStyle={{ backgroundColor: "#00AB67" }}
          />
        </View>
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.text}> Access radius: </Text>
        <TextInput style={styles.input} placeholder={"Range (metres)"} value={radius} onChangeText={(radius) => setRadius(radius)} />
      </View>
      <Button buttonStyle={styles.addBtn} titleStyle={styles.btnText} title="Add Site" onPress={handleAddSite} />
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
    alignItems: "center",
  },
  fieldContainer: {
    width: "100%",
    alignItems: "center",
    marginVertical: 15,
  },
  text: {
    fontSize: 24,
    textAlign: "left",
    color: "white",
  },
  buttonsContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "70%",
    height: 40,
    fontSize: 25,
    marginLeft: 0,
  },
  addBtn: {
    width: 200,
    marginTop: 20,
    backgroundColor: "#FFF",
  },
  btnText: {
    color: "#005131",
    fontWeight: "bold",
  },
  header: {
    margin: 20,
    fontSize: 30,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  input: {
    backgroundColor: "#fff",
    width: "85%",
    height: 40,
    fontSize: 20,
    marginTop: 10,
    paddingHorizontal: 10,
  },
});

export default AddSiteScreen;
