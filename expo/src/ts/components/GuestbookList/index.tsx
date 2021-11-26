import React from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import GuestbookCard from "../GuestbookCard";

const GuestbookList = (props: any) => {
  const { locations, parkId } = props;

  if (locations.length == 0) {
    return (
      <View style={styles.guestbookList}>
        <Text style={styles.text}>No guestbooks found - explore and try to find one!</Text>
      </View>
    );
  } else {
    return (
      <View style={styles.guestbookList}>
        <FlatList
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          data={locations}
          keyExtractor={(item) => item._id.toString()}
          renderItem={({ item }) => (
            <GuestbookCard
              key={item._id}
              onGuestbookSelect={props.onGuestbookSelect}
              parkId={parkId}
              locationName={item.name}
              locationId={item._id}
            />
          )}
        />
      </View>
    );
  }
};

export default GuestbookList;

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    marginLeft: 20,
    marginTop: 40,
    textAlign: "left",
    color: "white",
  },
  guestbookList: {
    height: 150,
    alignItems: "center",
    flexDirection: "row",
  },
});
