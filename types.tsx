import { NativeStackScreenProps } from '@react-navigation/native-stack';

type RootStackParamList = {
  Home: undefined;
  Map: undefined;
};

type HomeScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'Home'>;
type MapScreenNavigationProp = NativeStackScreenProps<RootStackParamList, 'Map'>;

export { 
    HomeScreenNavigationProp,
    MapScreenNavigationProp
}