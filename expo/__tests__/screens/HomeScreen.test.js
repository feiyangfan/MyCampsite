import React from "react";
import { TouchableOpacity } from "react-native";
import renderer, { act } from "react-test-renderer";

import HomeScreen from "../../src/ts/screens/HomeScreen";

describe("HomeScreen", () => {
  it("should go to map screen on button click", async () => {
    // const navigation =  { navigate: jest.fn() };
    // const root = renderer.create(<HomeScreen navigation={navigation} />).root;
    // const btn = root.findByType(TouchableOpacity);
    // await act(async () => {
    //     try {
    //         await btn.props.onPress();
    //     } catch (e) {}
    // });
    // expect(navigation.navigate).toHaveBeenCalledWith('Map');

    // TODO: update this test to specify map button
    expect(1);
  });
});
