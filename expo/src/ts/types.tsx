import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type RootStackParamList = {
  Home: undefined;
  Map: {
    ignoreDeviceLocation: boolean;
  };
  SignIn: undefined;
  Guestbook: {
    parkId: any;
    locationId: any;
    locationName: String;
    posts: any;
  };
  Post: {
    post: any;
  };
  AddSite: {
    location: any;
    parkId: any;
  };
  Me: undefined;
  Record: undefined;
  AddPost: undefined;
};

type HomeScreenNavigationProp = NativeStackScreenProps<RootStackParamList, "Home">;
type MapScreenNavigationProp = NativeStackScreenProps<RootStackParamList, "Map">;
type GuestbookScreenNavigationProp = NativeStackScreenProps<RootStackParamList, "Guestbook">;
type PostScreenNavigationProp = NativeStackScreenProps<RootStackParamList, "Post">;
type AddSiteScreenNavigationProp = NativeStackScreenProps<RootStackParamList, "AddSite">;
type RecordScreenNavigationProp = NativeStackScreenProps<RootStackParamList, "Record">;
type AddPostScreenNavigationProp = NativeStackScreenProps<RootStackParamList, "AddPost">;

export {
  HomeScreenNavigationProp,
  MapScreenNavigationProp,
  GuestbookScreenNavigationProp,
  PostScreenNavigationProp,
  AddSiteScreenNavigationProp,
  RecordScreenNavigationProp,
  AddPostScreenNavigationProp,
};
