import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type RootStackParamList = {
  Home: {
    deleteSite: any;
    addSite: any;
  };
  Map: {
    ignoreDeviceLocation: boolean;
  };
  SignIn: undefined;
  Guestbook: {
    parkId: any;
    locationId: any;
    locationName: string;
  };
  Post: {
    post: any;
    parkId: string;
  };
  AddSite: {
    location: any;
    parkId: any;
  };
  Me: undefined;
  Record: { locationId: string };
  AddPost: { source: string; locationId: string };
  NewEntry: { parkId: any; locationId: any; locationName: string; source: string };
};

type HomeScreenNavigationProp = NativeStackScreenProps<RootStackParamList, "Home">;
type MapScreenNavigationProp = NativeStackScreenProps<RootStackParamList, "Map">;
type GuestbookScreenNavigationProp = NativeStackScreenProps<RootStackParamList, "Guestbook">;
type PostScreenNavigationProp = NativeStackScreenProps<RootStackParamList, "Post">;
type AddSiteScreenNavigationProp = NativeStackScreenProps<RootStackParamList, "AddSite">;
type RecordScreenNavigationProp = NativeStackScreenProps<RootStackParamList, "Record">;
type AddPostScreenNavigationProp = NativeStackScreenProps<RootStackParamList, "AddPost">;
type NewEntryScreenNavigationProp = NativeStackScreenProps<RootStackParamList, "NewEntry">;

export {
  HomeScreenNavigationProp,
  MapScreenNavigationProp,
  GuestbookScreenNavigationProp,
  PostScreenNavigationProp,
  AddSiteScreenNavigationProp,
  RecordScreenNavigationProp,
  AddPostScreenNavigationProp,
  NewEntryScreenNavigationProp,
};
