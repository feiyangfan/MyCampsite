import React from "react"
import {ActivityIndicator, View} from "react-native"
import {Button, Card, Text} from "react-native-elements"
import {AuthWallAction, useAuthWall} from "../lib/auth"
import Profile from "../components/profile"

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
        <View style={{margin: 15}}>
            <Button title="Sign Out" onPress={() => signOut()} />
        </View>
    )
}

const DebugInfo = () => {
    const {user} = useAuthWall()

    return (
        <View style={{margin: 15}}>
            <Text>uid: {user?.uid ?? "none"}</Text>
            <Text>email: {user?.email ?? "none"}</Text>
            <Text>anonymous: {user?.isAnonymous}</Text>
        </View>
    )
}

const Me = () => {
    const {authWallAction} = useAuthWall()

    return (
        <View style={{justifyContent: "center"}}>
            {authWallAction > AuthWallAction.pending && <SignIn />}
            {authWallAction == AuthWallAction.pending && <ActivityIndicator size="large" />}
            {authWallAction == AuthWallAction.accepted &&
                <View>
                    <Profile id={"XXXXXXXXXXXX"} />
                    <DebugInfo />
                    <SignOut />
                </View>
            }
        </View>
    )
}
export default Me
