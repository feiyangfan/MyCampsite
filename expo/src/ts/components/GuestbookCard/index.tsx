import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const GuestbookCard = (props: any) => {
  const { locationId, locationName } = props;

  return (
    <View>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => props.onGuestbookSelect(locationId, locationName)}
      >
        <Text style={styles.btnText}>{locationName}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
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

export default GuestbookCard;
