import React from "react";
import { View } from "react-native";
import GuestbookCard from "../GuestbookCard";

const GuestbookList = (props: any) => {
  const { locations } = props;

  return (
    <View style={{ alignItems: "center" }}>
      {locations.map((location: any) => {
        return (
          <GuestbookCard
            key={location.locationId}
            onGuestbookSelect={props.onGuestbookSelect}
            locationName={location.locationName}
            locationId={location.locationId}
          />
        );
      })}
    </View>
  );
};

export default GuestbookList;
