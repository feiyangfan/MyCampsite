import React from 'react';
import { TouchableOpacity } from "react-native";
import renderer, { act } from 'react-test-renderer';

import MapScreen from '../../src/ts/screens/MapScreen';

describe('MapScreen', () => {
    it('should go to home screen on button click', async () => {
        const navigation =  { navigate: jest.fn() };
        const root = renderer.create(<MapScreen navigation={navigation} />).root;
        const btn = root.findByType(TouchableOpacity);
        await act(async () => {
            try {
                await btn.props.onPress();
            } catch (e) {}
        }); 
        expect(navigation.navigate).toHaveBeenCalledWith('Home');
    });
});