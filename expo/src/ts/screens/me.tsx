import React from "react"
import {ActivityIndicator, View} from "react-native"
import {Button, Card, Text} from "react-native-elements"
import {AuthWallAction, useAuthWall} from "../lib/auth"

const SignIn = () => {
    const {signIn} = useAuthWall()

    return (
        <Card>
            <Card.Title>You are signed out</Card.Title>
            <Text>Sign in to do stuff</Text>
            <Card.Divider />
            <Button title="Sign In" onPress={() => signIn()} />
        </Card>
    )
}

const SignOut = () => {
    const {signOut} = useAuthWall()

    return (
        <View style={{paddingLeft: 15, paddingRight: 15}}>
            <Button title="Sign Out" onPress={() => signOut()} />
        </View>
    )
}

const Me = () => {
    const {authWallAction} = useAuthWall()

    return (
        <View style={{alignItems: "stretch", justifyContent: "center"}}>
            {authWallAction > AuthWallAction.pending && <SignIn />}
            {authWallAction == AuthWallAction.pending && <ActivityIndicator size="large" />}
            {authWallAction == AuthWallAction.accepted &&
                <View>
                    <Text>profile here</Text>
                    <SignOut />
                </View>
            }
        </View>
    )
}
export default Me
