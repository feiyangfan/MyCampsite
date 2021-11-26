import React from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import SpotlightCard from "../SpotlightCard";

const Spotlight = (props: any) => {
  //const { sites } = props;
  const image = { uri: "https://reactjs.org/logo-og.png" }; // for testing only
  const sites = [
    // for testing
    {
      _id: "1",
      name: "Stubb's Falls",
      location: "1, 1",
      spotlight: true,
      image: image,
    },
    {
      _id: "2",
      name: "site 2",
      location: "2, 2",
      spotlight: false,
      image: image,
    },
    {
      _id: "3",
      name: "Big Bend Lookout",
      location: "3, 3",
      spotlight: true,
      image: image,
    },
    {
      _id: "4",
      name: "site 4",
      location: "4, 4",
      spotlight: false,
      image: image,
    },
    {
      _id: "5",
      name: "Arrowhead Skating Trail",
      location: "5, 5",
      spotlight: true,
    },
  ];

  // filter out non spotlight sites
  const filteredSites = sites.filter((site) => {
    return site.spotlight === true;
  });

  if (filteredSites.length == 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>
          No spotlights found - not near any spotlight sites!
        </Text>
      </View>
    );
  } else {
    return (
      <View>
        <ScrollView contentContainerStyle={{ marginTop: 15 }} horizontal={true}>
          {filteredSites.map((site: any) => {
            return (
              <SpotlightCard
                key={site._id}
                onSpotlightSelect={props.onSpotlightSelect}
                siteId={site._id}
                siteName={site.name}
                siteImage={site.image}
              />
            );
          })}
        </ScrollView>
      </View>
    );
  }
};

export default Spotlight;

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    marginLeft: 20,
    marginTop: 40,
    textAlign: "center",
    color: "white",
  },
  container: {
    marginTop: 15,
    alignItems: "center",
    flexDirection: "row",
  },
});
