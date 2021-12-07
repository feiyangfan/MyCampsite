import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, TextInput, ScrollView } from "react-native";
import { Button, ButtonGroup } from "react-native-elements";
import * as Types from "../../types";
import { fetch, fetchJSON } from "../../lib/api";

const isAdmin = true; // For testing, give admin capability to all users. Must update later

const AddSiteScreen = ({ route, navigation }: Types.AddSiteScreenNavigationProp) => {
  const { location, parkId } = route.params;
  const [name, setName] = useState("");
  const [park, setPark] = useState("");
  const [radius, setRadius] = useState("");
  const [type, setType] = useState("Campsite");
  const [spotlight, setSpotlight] = useState(false);
  const [selectedTypeIndex, setSelectedTypeIndex] = useState(0);
  const [selectedSpotlightIndex, setSelectedSpotlightIndex] = useState(1);

  const typeButtons = ["Campsite", "Point of Interest"];
  const spotlightButtons = ["yes", "no"];

  // Get park name to suggest
  useEffect(() => {
    fetch(`/location/${parkId}`)
      .then((data) => data.json())
      .then((park) => {
        park !== null ? setPark(park.name) : setPark("");
      })
      .catch((error) => console.log(error));
  }, []);

  // Attempt to find parkId based on user input
  const findPark = (parkName: String) => {}; //TODO

  const handleSelectType = (index: any) => {
    setSelectedTypeIndex(index);
    if (index === 0) setType("campsite");
    else if (index === 1) setType("point of interest");
  };
  const handleSelectSpotlight = (index: any) => {
    setSelectedSpotlightIndex(index);
    if (index === 0) setSpotlight(true);
    else if (index === 1) setSpotlight(false);
  };
  const handleAddSite = async () => {
    let newSite = {
      name: name,
      location: {
        latitude: location[0],
        longitude: location[1],
        radius: radius ? Number.parseInt(radius) : 200,
        type: type,
        spotlight: spotlight,
      },
    };
    console.log(parkId, name, location, radius, type, spotlight);
    try {
      const savedSite = await fetchJSON(`/location/${parkId}/site`, "POST", newSite);
      alert("Site added!");
      navigation.navigate({ name: "Home", params: { addSite: savedSite, deleteSite: null }, merge: true });
    } catch (err) {
      console.log(err);
      alert("Add site failed");
    }
  };
  return (
    <View style={{ backgroundColor: "#005131" }}>
      <Button buttonStyle={styles.addBtn} titleStyle={styles.btnText} title="Add Site" onPress={handleAddSite} />
      <ScrollView keyboardShouldPersistTaps="never" contentContainerStyle={styles.container} nestedScrollEnabled={true}>
        <Text style={styles.header}>Add a new site at your current location:</Text>
        <View style={styles.fieldContainer}>
          <Text style={styles.text}> Park name: </Text>
          <TextInput style={styles.input} placeholder={"Park name"} value={park} onChangeText={(park) => setPark(park)} />
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.text}> Site name: </Text>
          <TextInput style={styles.input} placeholder={"Site name"} value={name} onChangeText={(name) => setName(name)} />
        </View>

        {isAdmin && (
          <View style={{ width: "100%" }}>
            <View style={styles.fieldContainer}>
              <Text style={styles.text}> Site type: </Text>
              <View style={styles.buttonsContainer}>
                <ButtonGroup
                  onPress={handleSelectType.bind(this)}
                  selectedIndex={selectedTypeIndex}
                  buttons={typeButtons}
                  containerStyle={{ height: "100%", width: "100%", marginLeft: 0 }}
                  buttonContainerStyle={{ backgroundColor: "#00301D" }}
                  selectedButtonStyle={{ backgroundColor: "#00AB67" }}
                />
              </View>
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.text}> Spotlight this site: </Text>
              <View style={styles.buttonsContainer}>
                <ButtonGroup
                  onPress={handleSelectSpotlight.bind(this)}
                  selectedIndex={selectedSpotlightIndex}
                  buttons={spotlightButtons}
                  containerStyle={{ height: "100%", width: "100%", marginLeft: 0 }}
                  buttonContainerStyle={{ backgroundColor: "#00301D" }}
                  selectedButtonStyle={{ backgroundColor: "#00AB67" }}
                />
              </View>
            </View>
            <View style={styles.fieldContainer}>
              <Text style={styles.text}> Access radius: </Text>
              <TextInput style={styles.input} placeholder={"Range (metres)"} value={radius} onChangeText={(radius) => setRadius(radius)} />
            </View>
          </View>
        )}
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
    marginTop: 15,
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
