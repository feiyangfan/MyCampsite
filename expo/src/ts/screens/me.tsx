import React from "react"
import {ActivityIndicator, View} from "react-native"
import {Button, Card, Text} from "react-native-elements"
import {AuthWallAction, useAuthWall, useAuth} from "../lib/auth"
import Profile from "../components/profile"

const DebugInfo = () => {
    const {user} = useAuth()

    return (
        <View style={{margin: 15}}>
            <Text>uid: {user?.uid ?? "none"}</Text>
            <Text>email: {user?.email ?? "none"}</Text>
            <Text>verified: {user?.emailVerified ? "true" : "false"}</Text>
            <Text>anonymous: {user?.isAnonymous ? "true" : "false"}</Text>
        </View>
    )
}

const Me = () => {
    const [authWallAction, present] = useAuthWall()
    const {signOut} = useAuth()

    return (
        <View style={{justifyContent: "center"}}>
            {authWallAction > AuthWallAction.wait &&
                <Card>
                    <Card.Title>You are signed out</Card.Title>
                    <Text>Sign in to do stuff</Text>
                    <Card.Divider />
                    <Button title="Sign In" onPress={() => present()} />
                </Card>
            }
            {authWallAction == AuthWallAction.wait &&
                <ActivityIndicator color="blue" size="large" />
            }
            {authWallAction == AuthWallAction.accept &&
                <View>
                    <Profile />
                    <View style={{margin: 15}}>
                        <Button title="Sign Out" onPress={() => signOut()} />
                    </View>
                </View>
            }
            <DebugInfo />
        </View>
    )
}
export default Me
