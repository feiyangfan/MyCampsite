import React from "react"
import {View} from "react-native"
import {Avatar, Card, Text} from "react-native-elements"
import {useAuthWall} from "../lib/auth"

const Profile = (props: {id: string}) => {
    const {user} = useAuthWall()

    return (
        <Card>
            <View style={{flexDirection: "row"}}>
                <Avatar size="large" title="ME" />
                <View style={{justifyContent: "space-evenly"}}>
                    <Text>Name</Text>
                    <Text>Email</Text>
                </View>
            </View>
        </Card>
    )
}
export default Profile
