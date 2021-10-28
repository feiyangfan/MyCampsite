import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import GuestbookCard from '../GuestbookCard';

const GuestbookList = (props: any) => {
  const { locations } = props;

  if (locations.length == 0) {
    return (
      <View style={styles.guestbookList}>
        <Text style={styles.text}>No guestbooks found - explore and try to find one!</Text>
      </View>
    );
  } else {
    return (
      <View style={styles.guestbookList}>
        {locations.map((location: any) => {
          return (
            <GuestbookCard key={location._id} onGuestbookSelect={props.onGuestbookSelect} locationName={location.name} locationId={location._id} />
          );
        })}
      </View>
    );
  }
};

export default GuestbookList;

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    marginLeft: 20,
    marginTop: 40,
    textAlign: 'left',
    color: 'white',
  },
  guestbookList: {
    height: 150,
    alignItems: 'center',
    flexDirection: 'row',
  },
});
