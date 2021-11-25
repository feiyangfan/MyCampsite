import React from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import * as Types from "../../types";
import WeatherWidget from "../../components/WeatherWidget";

const PostScreen = ({ route, navigation }: Types.PostScreenNavigationProp) => {
  const { post } = route.params;
  const { postId, date, locationId, locationName, weather, notes, url, userId } = post;

  return (
    <View style={styles.container}>
      <Text style={styles.siteName}>{locationName}</Text>
      <Text style={styles.date}>{date.replace("\n", ", ")}</Text>
      <WeatherWidget temp={weather.temp} condition={weather.condition} />
      <View style={styles.contentContainer}>
        <Text>content goes here</Text>
      </View>
      <Text style={styles.text}>{notes}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#005131",
    color: "white",
    height: "100%",
    flexDirection: "column",
    padding: 20,
    alignItems: "center",
  },
  siteName: {
    fontSize: 50,
    color: "white",
    margin: 10,
  },
  date: { fontSize: 30, color: "white", textAlign: "center", margin: 10 },
  text: {
    fontSize: 20,
    textAlign: "center",
    color: "white",
    margin: 10,
  },
  contentContainer: {
    margin: 10,
    marginTop: 20,
    width: 300,
    height: 300,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default PostScreen;
