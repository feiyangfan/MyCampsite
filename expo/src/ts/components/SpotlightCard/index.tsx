import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";

const SpotlightCard = (props: any) => {
  const { parkId, siteId, siteName, siteImage } = props;
  // if background image is set
  if (siteImage) {
    return (
      <View>
        <TouchableOpacity
          style={styles.card}
          onPress={() => props.onSpotlightSelect(parkId, siteId, siteName)}
        >
          <ImageBackground
            source={{ uri: siteImage }}
            resizeMode="cover"
            style={styles.image}
            imageStyle={{ borderRadius: 25 }}
          >
            <Text style={styles.cardText}>{siteName}</Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>
    );
  // no background image
  } else {
    return (
      <View>
        <TouchableOpacity
          style={[styles.card, { borderRadius: 25, backgroundColor: "white" }]}
          onPress={() => props.onSpotlightSelect(parkId, siteId, siteName)}
        >
          <Text style={[styles.cardText, { color: "#005131" }]}>
            {siteName}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
};

// style for spotlight card
const styles = StyleSheet.create({
  cardText: {
    padding: 10,
    textAlign: "center",
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 5, height: 5 },
    textShadowRadius: 3,
  },
  card: {
    margin: 8,
    width: 150,
    height: 250,
    justifyContent: "center",
  },
  image: {
    flex: 1,
    justifyContent: "center",
  },
});

export default SpotlightCard;
