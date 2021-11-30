import React, { ReactNode, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { ThemeProvider } from "react-native-elements";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./src/ts/lib/config";
import { useAuth } from "./src/ts/lib/auth";
import HomeScreen from "./src/ts/screens/HomeScreen";
import MapScreen from "./src/ts/screens/MapScreen";
import GuestbookScreen from "./src/ts/screens/GuestbookScreen";
import PostScreen from "./src/ts/screens/PostScreen";
import SignIn from "./src/ts/screens/signin";
import Me from "./src/ts/screens/me";
import { theme } from "./src/ts/lib/theme";
import { RootStackParamList } from "./src/ts/types";
import store from "./src/ts/lib/store";
import RecordScreen from "./src/ts/screens/RecordScreen";
import AddPost from "./src/ts/screens/AddPostScreen";
import AddSiteScreen from "./src/ts/screens/AddSiteScreen";
import NewEntryScreen from "./src/ts/screens/NewEntryScreen";

initializeApp(firebaseConfig);

const FirebaseAuthListener = (props: { children: ReactNode }) => {
  const { addListener } = useAuth();

  useEffect(() => {
    const unsub = addListener();
    return () => unsub();
  }, []);

  return <>{props.children}</>;
};

const GlobalProviders = (props: { children: ReactNode }) => (
  <SafeAreaProvider>
    <Provider store={store}>
      <FirebaseAuthListener>
        <ThemeProvider theme={theme}>{props.children}</ThemeProvider>
      </FirebaseAuthListener>
    </Provider>
  </SafeAreaProvider>
);

const Stack = createNativeStackNavigator<RootStackParamList>();
const App = () => {
  return (
    <GlobalProviders>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: true,
            headerStyle: { backgroundColor: "#00AB67" },
            headerTintColor: "#fff",
            headerTitleStyle: { fontSize: 25, fontWeight: "bold" },
          }}>
          <Stack.Group
            screenOptions={{
              title: "My Campsite",
            }}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Map" component={MapScreen} />
            <Stack.Screen name="Guestbook" component={GuestbookScreen} />
            <Stack.Screen name="Post" component={PostScreen} />
            <Stack.Screen name="Record" component={RecordScreen} />
            <Stack.Screen name="AddPost" component={AddPost} />
            <Stack.Screen name="AddSite" component={AddSiteScreen} />
            <Stack.Screen name="NewEntry" component={NewEntryScreen} />
          </Stack.Group>
          <Stack.Group screenOptions={{ presentation: "modal" }}>
            <Stack.Screen name="SignIn" component={SignIn} />
          </Stack.Group>
          <Stack.Group screenOptions={{ presentation: "modal" }}>
            <Stack.Screen name="Me" component={Me} />
          </Stack.Group>
        </Stack.Navigator>
      </NavigationContainer>
    </GlobalProviders>
  );
};

export default App;
