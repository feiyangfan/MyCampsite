import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type RootStackParamList = {
  Home: undefined;
  Map: undefined;
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
  Record: undefined;
  AddPost: undefined;
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
type RecordScreenNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  "Record"
>;
type AddPostScreenNavigationProp = NativeStackScreenProps<
  RootStackParamList,
  "AddPost"
>;

export {
  HomeScreenNavigationProp,
  MapScreenNavigationProp,
  GuestbookScreenNavigationProp,
  PostScreenNavigationProp,
  RecordScreenNavigationProp,
  AddPostScreenNavigationProp
};
