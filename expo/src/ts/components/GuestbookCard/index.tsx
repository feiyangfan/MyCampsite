import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const GuestbookCard = (props: any) => {
  const { parkId, locationId, locationName } = props;

  return (
    <View>
      <TouchableOpacity style={styles.btn} onPress={() => props.onGuestbookSelect(parkId, locationId, locationName)}>
        <Text style={styles.btnText}>{locationName}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  btnText: {
    textAlign: "center",
    color: "#005131",
    fontSize: 20,
    fontWeight: "bold",
  },
  btn: {
    backgroundColor: "white",
    borderWidth: 1,
    borderRadius: 10,
    padding: 7,
    width: 120,
    height: 120,
    justifyContent: "center",
    marginLeft: 10,
  },
});

export default GuestbookCard;
