import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import * as VideoThumbnails from "expo-video-thumbnails";
import { MaterialIcons } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { FileSystemUploadOptions, FileSystemUploadType, uploadAsync } from "expo-file-system";
import { AddPostScreenNavigationProp } from "../../types";
import { fetchJSON } from "../../lib/api";

const DismissKeyboard = ({ children }) => <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>{children}</TouchableWithoutFeedback>;

// ignore this error, typescript is just odd
export default function AddPost(props: AddPostScreenNavigationProp) {
  // will be used in navigation on page
  const navigation = props.navigation;

  // variable used to keep track of image source
  const [image, setImage] = useState<string>();

  const [description, setDescription] = useState("");
  const [querying, setQuerying] = useState(false);
  const [completed, setCompleted] = useState(false);

  // creating thumbnail for video
  // code was inspired by https://docs.expo.dev/versions/latest/sdk/video-thumbnails
  const generateThumbnail = async () => {
    try {
      const { uri } = await VideoThumbnails.getThumbnailAsync(
        // THIS RIGHT HERE IS THE FILEPATH TO THE VIDEO
        props.route.params.source,
        {
          time: 2,
        }
      );
      // Setting thumbnail path
      setImage(uri);
    } catch (e) {
      console.warn(e);
    }
  };
  // Calling on it to generate the video thumbnail at the beginning of the video
  useEffect(() => {
    generateThumbnail();
  }, []);

  useEffect(() => {
    if (completed) {
      alert("Your post has been submitted!");
      navigation.navigate("Home");
    }
  });

  const handleSavePost = async () => {
    if (!props.route.params.source || !image) {
      console.error("Missing video or thumbnail");
      return;
    }
    if (querying) return;

    setQuerying(true);
    try {
      const { id, signedURL, thumbnailSignedURL } = await fetchJSON("/post", "POST", {
        siteId: props.route.params.locationId,
        notes: description,
      });

      let fileExtension = props.route.params.source.substr(props.route.params.source.lastIndexOf(".") + 1);
      let options: FileSystemUploadOptions = {
        httpMethod: "PUT",
        headers: {},
      };
      if (fileExtension === "mov") {
        options.headers = { "Content-Type": "video/quicktime" };
      } else if (fileExtension === "mp4") {
        options.headers = { "Content-Type": "video/mp4" };
      }

      if (!signedURL || !thumbnailSignedURL) throw new Error("Missing signed URL from /post response");
      const uploadRes = await uploadAsync(signedURL, props.route.params.source, options);
      if (uploadRes.status < 200 || uploadRes.status >= 300) throw new Error("Failed to upload video");
      let thumbnailRes = await uploadAsync(thumbnailSignedURL, image, { httpMethod: "PUT" });
      if (thumbnailRes.status < 200 || thumbnailRes.status >= 300) throw new Error("Failed to upload thumbnail");
      const post = await fetchJSON(`/post/${id}`, "POST", {
        finish: true,
      });
      console.log(`Finished updating post ${post.id}`);
      setCompleted(true);
    } catch (error) {
      console.error(error);
    } finally {
      setQuerying(false);
    }
  };

  return (
    <DismissKeyboard>
      <View style={styles.container}>
        <View style={styles.descriptionContainer}>
          {image && <Image source={{ uri: image }} style={styles.thumbnail} />}
          <TextInput
            placeholder="Add Post Description"
            value={description}
            onChangeText={(text) => setDescription(text)}
            multiline
            maxLength={150}
            style={styles.description}
          />
        </View>
        <View style={styles.spacer} />
        <KeyboardAvoidingView behavior={Platform.OS === "android" ? "height" : "padding"}>
          <View style={styles.btnsContainer}>
            <TouchableOpacity onPress={() => navigation.navigate("Record", { locationId: props.route.params.locationId })} style={styles.backButton}>
              <Feather name="x" size={24} color="black" />
              <Text style={styles.backButtonText}>Cancel</Text>
            </TouchableOpacity>
            {/* handleSavePost is called HERE */}
            <TouchableOpacity onPress={handleSavePost} style={styles.postButton}>
              {querying && <ActivityIndicator size="large" color="white" />}
              {!querying && (
                <>
                  <Ionicons name="send-outline" size={24} color="white" />
                  <Text style={styles.PostButtonText}>Post</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </DismissKeyboard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
  descriptionContainer: {
    margin: 20,
    flexDirection: "column",
    alignItems: "center",
  },
  description: {
    paddingVertical: 10,
    marginRight: 20,
    fontSize: 22,
  },
  thumbnail: {
    aspectRatio: 9 / 16,
    backgroundColor: "black",
    width: 300,
    height: 300,
  },
  btnsContainer: {
    flexDirection: "row",
    marginHorizontal: 5,
    marginBottom: 30,
  },
  backButton: {
    alignItems: "center",
    flex: 1,
    borderColor: "#4C9A2A",
    borderWidth: 1,
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: "center",
    borderRadius: 7,
    margin: 5,
  },

  postButton: {
    alignItems: "center",
    flex: 1,
    borderColor: "#4C9A2A",
    backgroundColor: "#4C9A2A",
    borderWidth: 1,
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: "center",
    borderRadius: 7,
    margin: 5,
  },
  backButtonText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "black",
    margin: 5,
  },
  PostButtonText: {
    fontWeight: "bold",
    fontSize: 16,
    color: "white",
    margin: 5,
  },
  spacer: {
    flex: 1,
  },
});
