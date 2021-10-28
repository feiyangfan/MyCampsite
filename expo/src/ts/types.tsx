import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type RootStackParamList = {
  Home: undefined;
  Map: {
    ignoreDeviceLocation: boolean;
  };
  SignIn: undefined;
  Guestbook: {
    locationId: any;
    locationName: String;
    posts: any;
  };
  Post: {
    post: any;
  };
  Me: undefined;
};

type HomeScreenNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  "Home"
>;
type MapScreenNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  "Map"
>;
type GuestbookScreenNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  "Guestbook"
>;
type PostScreenNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  "Post"
>;

export {
  HomeScreenNavigationProp,
  MapScreenNavigationProp,
  GuestbookScreenNavigationProp,
  PostScreenNavigationProp,
};
