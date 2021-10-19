import { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  Map: undefined;
  SignIn: undefined;
};

type HomeScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'Home'>;
type MapScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'Map'>;

export { 
    HomeScreenNavigationProp,
    MapScreenNavigationProp
}