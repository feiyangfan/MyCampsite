import React from "react"
import {ActivityIndicator, View} from "react-native"
import {Avatar, Card, Text} from "react-native-elements"
import {useProfile} from "../lib/profile"

const Profile = (props: {id?: string}) => {
    const [profile, profileValid] = useProfile(props.id)

    if (!profileValid)
        return <ActivityIndicator color="blue" size="large" />
    return (
        <Card>
            <View style={{flexDirection: "row"}}>
                <Avatar size="large" title="ME" />
                <View style={{justifyContent: "space-evenly"}}>
                    <Text>{profile?.displayName ?? "No name"}</Text>
                    <Text>Joined since: {profile?.creationDate}</Text>
                </View>
            </View>
        </Card>
    )
}
export default Profile
