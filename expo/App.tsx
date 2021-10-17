import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {initializeApp} from 'firebase/app'
import HomeScreen from './src/ts/screens/HomeScreen';
import MapScreen from './src/ts/screens/MapScreen';
import {firebaseConfig} from "./src/ts/lib/config"

initializeApp(firebaseConfig)

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Map" component={MapScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
