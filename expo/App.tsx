import React, { ReactNode } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ThemeProvider } from "react-native-elements";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./src/ts/lib/config";
import HomeScreen from "./src/ts/screens/HomeScreen";
import MapScreen from "./src/ts/screens/MapScreen";
import GuestbookScreen from "./src/ts/screens/GuestbookScreen";
import PostScreen from "./src/ts/screens/PostScreen";
import SignIn from "./src/ts/screens/signin";
import theme from "./src/ts/lib/theme";
import { RootStackParamList } from "./types";

initializeApp(firebaseConfig);

const Stack = createNativeStackNavigator<RootStackParamList>();

const LayoutProviders = (props: { children: ReactNode }) => (
  <SafeAreaProvider>
    <ThemeProvider theme={theme}>{props.children}</ThemeProvider>
  </SafeAreaProvider>
);

const App = () => {
  return (
    <LayoutProviders>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Group>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Map" component={MapScreen} />
            <Stack.Screen name="Guestbook" component={GuestbookScreen} />
            <Stack.Screen name="Post" component={PostScreen} />
          </Stack.Group>
          <Stack.Group screenOptions={{ presentation: "transparentModal" }}>
            <Stack.Screen name="SignIn" component={SignIn} />
          </Stack.Group>
        </Stack.Navigator>
      </NavigationContainer>
    </LayoutProviders>
  );
};

export default App;
