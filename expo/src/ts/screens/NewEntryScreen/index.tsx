import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button } from "react-native-elements";
import * as Types from "../../types";

const NewEntryScreen = ({ route, navigation }: Types.GuestbookScreenNavigationProp) => {
  return (
    <View>
      <Button buttonStyle={styles.button} title="Record" onPress={() => navigation.navigate("Record")} />
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    margin: 15,
    width: 200,
    backgroundColor: "#00AB67",
  },
});

export default NewEntryScreen;
