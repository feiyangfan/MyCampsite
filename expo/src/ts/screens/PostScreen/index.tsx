import React from "react";
import { Text, View, StyleSheet, Alert } from "react-native";
import { Icon } from "react-native-elements";
import * as Types from "../../types";
import WeatherWidget from "../../components/WeatherWidget";

const isAdmin = true; // Temporary
const postURL = "";
const deletePost = (postId: any) => {
  try {
    alert("This doesn't work yet!");
    // fetch(`${postURL}/${postId}`, {
    //   method: "DELETE",
    // });
  } catch (err) {
    alert("Failed to delete post");
  }
};

const PostScreen = ({ route, navigation }: Types.PostScreenNavigationProp) => {
  const { post } = route.params;
  const { postId, date, locationId, locationName, weather, notes, url, userId } = post;

  const showConfirmDialog = () => {
    return Alert.alert("Delete post", "Are you sure you want to delete this post?", [
      {
        text: "Yes",
        onPress: () => {
          deletePost(postId);
        },
      },
      { text: "No" },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.siteName}>{locationName}</Text>
      <Text style={styles.date}>{date.replace("\n", ", ")}</Text>
      <WeatherWidget temp={weather.temp} condition={weather.condition} />
      <View style={styles.contentContainer}>
        <Text>content goes here</Text>
      </View>
      <Text style={styles.text}>{notes}</Text>

      {isAdmin && (
        <View style={styles.deletePost}>
          <Icon name="remove-circle-outline" color="red" size={30} onPress={showConfirmDialog} />
          <Text style={styles.text}>Delete this post</Text>
        </View>
      )}
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
  deletePost: { flexDirection: "row", justifyContent: "center", alignItems: "center", padding: 10, marginTop: 50 },
});

export default PostScreen;
