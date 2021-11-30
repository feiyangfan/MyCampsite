import React from "react";
import { ScrollView, View, Text, StyleSheet } from "react-native";
import SpotlightCard from "../SpotlightCard";

const Spotlight = (props: any) => {
  const { parkId, sites } = props;
  
  // filter out non spotlight sites
  const filteredSites = sites.filter((site: any) => {
    return site.spotlight === true;
  });
  
  if (filteredSites.length == 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>
          No spotlights found - not near any spotlights!
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
                parkId={parkId}
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
    marginBottom: 40,
    textAlign: "center",
    color: "white",
  },
  container: {
    marginTop: 15,
    alignItems: "center",
    flexDirection: "row",
  },
});
