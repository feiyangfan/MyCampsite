import React, { useState } from 'react';
import { Text, View, StyleSheet, TextInput } from 'react-native';
import { Button } from 'react-native-elements';
import * as Types from '../../types';

const AddSiteScreen = ({ route, navigation }: Types.AddSiteScreenNavigationProp) => {
  const { location, parkId } = route.params;
  const locationURL = 'http://mycampsite-team12.herokuapp.com/location';
  const [name, setName] = useState('');
  const [radius, setRadius] = useState('');

  const handleAddSite = () => {
    console.log(name, radius);
    try {
      fetch(`${locationURL}/${parkId}/site/`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          location: {
            latitude: location[0],
            longitude: location[1],
            radius: radius,
          },
        }),
      });

      setName('');
      setRadius('');
    } catch (err) {
      console.log('Add site failed');
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Add a new site at your current location:</Text>
      <Text style={styles.text}> Site name: </Text>
      <TextInput style={styles.input} placeholder={'Site name'} value={name} onChangeText={(name) => setName(name)} />
      <Text style={styles.text}> Distance from which site can be viewed: </Text>
      <TextInput style={styles.input} placeholder={'Range (metres)'} value={radius} onChangeText={(radius) => setRadius(radius)} />
      <Button buttonStyle={styles.addBtn} titleStyle={styles.btnText} title="Add Site" onPress={handleAddSite} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#005131',
    color: 'white',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    textAlign: 'left',
    color: 'white',
    marginTop: 20,
  },

  addBtn: {
    marginTop: 100,
    width: 200,
    backgroundColor: '#FFF',
  },
  btnText: {
    color: '#005131',
    fontWeight: 'bold',
  },
  header: {
    margin: 20,
    fontSize: 25,
    fontWeight: 'bold',
    color: '#fff',
  },
  input: {
    backgroundColor: '#fff',
    width: '85%',
    height: 40,
    fontSize: 20,
    marginVertical: 10,
    paddingHorizontal: 10,
  },
});

export default AddSiteScreen;
