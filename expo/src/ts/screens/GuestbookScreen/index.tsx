import React from "react";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import * as Types from "../../../../types";

const GuestbookScreen = ({
  route,
  navigation,
}: Types.GuestbookScreenNavigationProp) => {
  const { locationId, locationName, posts } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{locationName} Guestbook</Text>

      {posts &&
        posts.map((post: any) => {
          return (
            <View key={post.postId} style={styles.btnWrapper}>
              <TouchableOpacity
                style={styles.btn}
                onPress={() => navigation.navigate("Post", { post: post })}
              >
                <Text style={styles.text}>{post.date}</Text>
              </TouchableOpacity>
            </View>
          );
        })}

      <View style={styles.btnWrapper}>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => navigation.navigate("Home")}
        >
          <Text style={styles.btnText}>Go To Home</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#334257",
    color: "white",
    height: "100%",
    flexDirection: "column",
    justifyContent: "space-evenly",
  },
  text: {
    fontSize: 20,
    textAlign: "center",
    color: "white",
  },
  btnWrapper: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
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

export default GuestbookScreen;
