import React, { useState } from "react";
import { Text, View, StyleSheet, Alert } from "react-native";
import { Icon, Image } from "react-native-elements";
import { Video } from "expo-av";
import * as Types from "../../types";
import WeatherWidget from "../../components/WeatherWidget";
import { useSite } from "../../lib/location";

const isAdmin = true; // Temporary

const deletePost = (postId: any) => {
  try {
    alert("This doesn't work yet!");
    // fetch(`/post/${postId}`, {
    //   method: "DELETE",
    // });
  } catch (err) {
    alert("Failed to delete post");
  }
};

// Format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toDateString().substr(4, 12);
};

const PostScreen = ({ route, navigation }: Types.PostScreenNavigationProp) => {
  const { post } = route.params;
  const { _id, createdAt, siteId, weatherTemp, weatherDesc, notes, publicURL, thumbnailPublicURL, profile } = post;
  const [showPlayer, setShowPlayer] = useState(false);
  const site = useSite(siteId, route.params.parkId);

  const showConfirmDialog = () => {
    return Alert.alert("Delete post", "Are you sure you want to delete this post?", [
      {
        text: "Yes",
        onPress: () => {
          deletePost(_id);
        },
      },
      { text: "No" },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.siteName}>{site.state?.name}</Text>
      <Text style={styles.date}>{formatDate(createdAt)}</Text>
      <WeatherWidget temp={weatherTemp} condition={weatherDesc} />
      <View style={styles.contentContainer}>
        {showPlayer && <Video style={styles.thumbnail} source={{ uri: publicURL }} useNativeControls isLooping shouldPlay resizeMode="contain" />}
        {!showPlayer && (
          <Image source={{ uri: thumbnailPublicURL }} resizeMode="cover" style={styles.thumbnail} onPress={() => setShowPlayer(true)} />
        )}
      </View>
      <Text style={styles.text}>{notes}</Text>

      {isAdmin && (
        <View style={styles.deletePost}>
          <Icon name="remove-circle-outline" color="red" size={30} onPress={showConfirmDialog} />
          <Text style={styles.deleteText}>Delete this post</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#005131",
    color: "white",
    flexDirection: "column",
    flex: 1,
    alignItems: "center",
  },
  siteName: {
    flex: 1,
    fontSize: 40,
    color: "white",
    margin: 10,
  },
  date: { flex: 1, fontSize: 30, color: "white", textAlign: "center", margin: 10 },
  text: {
    flex: 2,
    fontSize: 20,
    textAlign: "center",
    color: "white",
    margin: 10,
  },
  contentContainer: {
    flex: 6,
    width: "100%",
    marginTop: 20,
    backgroundColor: "white",
    alignItems: "stretch",
    justifyContent: "space-between",
  },
  thumbnail: {
    width: "100%",
    height: "100%",
  },
  deletePost: { flex: 1, flexDirection: "row", justifyContent: "center", alignItems: "center", padding: 10, marginTop: "auto" },
  deleteText: {
    fontSize: 20,
    textAlign: "center",
    color: "white",
    margin: 10,
  },
});

export default PostScreen;
