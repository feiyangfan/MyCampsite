import React from "react"
import {View} from "react-native"
import {useAuthWall} from "../lib/auth"
import {Button, Text} from "react-native-elements"

const Me = () => {
    const [user, authWallAction, authWall] = useAuthWall()

    return (
        <View>
            <Text>User ID: {user?.uid}</Text>
            <Text>Auth wall action: {authWallAction}</Text>
            <Button title="Sign In" onPress={() => authWall()} />
        </View>
    )
}
export default Me
