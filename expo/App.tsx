import React, { ReactNode } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ThemeProvider } from "react-native-elements";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {Provider} from "react-redux";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./src/ts/lib/config";
import HomeScreen from "./src/ts/screens/HomeScreen";
import MapScreen from "./src/ts/screens/MapScreen";
import GuestbookScreen from "./src/ts/screens/GuestbookScreen";
import PostScreen from "./src/ts/screens/PostScreen";
import SignIn from "./src/ts/screens/signin";
import Me from "./src/ts/screens/me";
import theme from "./src/ts/lib/theme";
import { RootStackParamList } from "./src/ts/types";
import store from "./src/ts/lib/store"

initializeApp(firebaseConfig);

const GlobalProviders = (props: { children: ReactNode }) => (
  <SafeAreaProvider>
    <Provider store={store}>
      <ThemeProvider theme={theme}>{props.children}</ThemeProvider>
    </Provider>
  </SafeAreaProvider>
);

const Stack = createNativeStackNavigator<RootStackParamList>();
const App = () => {
  return (
    <GlobalProviders>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Group screenOptions={{headerShown: false}}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Map" component={MapScreen} />
            <Stack.Screen name="Guestbook" component={GuestbookScreen} />
            <Stack.Screen name="Post" component={PostScreen} />
          </Stack.Group>
          <Stack.Group screenOptions={{presentation: "transparentModal"}}>
            <Stack.Screen name="SignIn" component={SignIn} />
          </Stack.Group>
          <Stack.Group screenOptions={{presentation: "modal"}}>
            <Stack.Screen name="Me" component={Me} />
          </Stack.Group>
        </Stack.Navigator>
      </NavigationContainer>
    </GlobalProviders>
  );
};

export default App;
