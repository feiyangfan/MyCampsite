import React, {useEffect} from "react"
import {StyleSheet, View} from "react-native"
import {Button, Input, BottomSheet, Divider, Header} from "react-native-elements"
import {useGoogleSignInPrompt, useUser} from "../lib/auth"
import {NavigationProp, useNavigation} from "@react-navigation/native"
import {RootStackParamList} from "../types"
import {useAppDispatch} from "../lib/store"
import authSlice from "../lib/auth/slice"

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        flexDirection: "column",
        justifyContent: "space-evenly",
        padding: 5,
        paddingTop: 15
    }
})

const SignIn = () => {
    const [user] = useUser()
    const googleSignIn = useGoogleSignInPrompt()
    const nav = useNavigation<NavigationProp<RootStackParamList, "SignIn">>()
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(authSlice.actions.presentAuthWall())
    }, [])

    useEffect(() => {
        const unsub = nav.addListener("beforeRemove", () => {
            const uid = user?.uid ?? null // there's undefined and null
            console.log(`Dismissing sign in screen, uid: ${uid}`)
            dispatch(authSlice.actions.dismissAuthWall(uid))
        })
        return () => unsub()
    }, [])

    return (
        // This is likely not the right way of doing things but I want a bottom sheet now, fix later
        <BottomSheet isVisible>
            <Header
                centerComponent={{text: "Sign in to continue"}}
                rightComponent={{text: "Cancel", onPress: () => nav.goBack()}}
            />
            <View style={styles.container}>
                <View style={styles.container}>
                    <Input placeholder="Email" />
                    <Input placeholder="Password" secureTextEntry />
                </View>
                <Divider subHeader="Or" />
                <View style={styles.container}>
                    <Button title="Sign In with Google" onPress={() => googleSignIn()} />
                    <Button title="Sign In with Facebook" onPress={() => {}} />
                </View>
            </View>
        </BottomSheet>
    )
}
export default SignIn
