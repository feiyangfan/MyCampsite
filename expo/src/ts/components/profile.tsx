import React from "react"
import {View} from "react-native"
import {Avatar, Text} from "react-native-elements"
import {User} from "firebase/auth"

const Profile = (props: {user: User}) => {
    return (
        <View style={{alignItems: "center"}}>
            <Avatar size="large" rounded title="ME" />
            <Text h4>{props.user.displayName}</Text>
            {props.user.email && <Text>{props.user.email}</Text>}
        </View>
    )
}
export default Profile
