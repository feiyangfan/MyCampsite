import React from 'react';
import { View } from 'react-native';
import GuestbookCard from '../GuestbookCard';

const GuestbookList = (props: any) => {
  const { locations } = props;

  return (
    <View style={{ alignItems: 'center' }}>
      {locations.map((location: any) => {
        return (
          <GuestbookCard key={location._id} onGuestbookSelect={props.onGuestbookSelect} locationName={location.name} locationId={location._id} />
        );
      })}
    </View>
  );
};

export default GuestbookList;
