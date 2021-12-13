import React from "react"
import {ActivityIndicator, View} from "react-native"
import {Avatar, Button, Card, Text} from "react-native-elements"
import {useProfile} from "../lib/profile"

const Profile = (props: {id?: string, edit?: boolean}) => {
    const profile = useProfile(props.id)

    if (profile.querying)
        return <ActivityIndicator color="blue" size="large" />
    return (
        <Card>
            <View style={{flexDirection: "row"}}>
                <Avatar
                    size="large"
                    source={{uri: profile.value?.profilePicURL}}
                    title="ME"
                >
                    {
                        props.edit &&
                        <Button
                            type="clear"
                            title="Edit"
                        />
                    }
                </Avatar>
                <View style={{justifyContent: "space-evenly"}}>
                    <Text>{profile.value?.displayName ?? "No name"}</Text>
                    <Text>Joined since: {profile.value?.creationDate}</Text>
                </View>
            </View>
        </Card>
    )
}
export default Profile
