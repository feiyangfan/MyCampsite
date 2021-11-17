import React from "react"
import {ActivityIndicator, View} from "react-native"
import {Avatar, Button, Card, Text} from "react-native-elements"
import {useProfile} from "../lib/profile"

const Profile = (props: {id?: string, edit?: boolean}) => {
    const {profile, querying, update} = useProfile(props.id)

    if (querying)
        return <ActivityIndicator color="blue" size="large" />
    return (
        <Card>
            <View style={{flexDirection: "row"}}>
                <Avatar
                    size="large"
                    source={{uri: profile?.profilePicURL}}
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
                    <Text>{profile?.displayName ?? "No name"}</Text>
                    <Text>Joined since: {profile?.creationDate}</Text>
                </View>
            </View>
        </Card>
    )
}
export default Profile
