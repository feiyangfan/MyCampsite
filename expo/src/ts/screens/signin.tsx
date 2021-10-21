import React, {useEffect} from "react"
import {StyleSheet, View} from "react-native"
import {Button, Input, BottomSheet, Divider, Header} from "react-native-elements"
import {useGoogleSignInPrompt, useUser} from "../lib/auth"
import {NavigationProp, RouteProp, useNavigation, useRoute} from "@react-navigation/native"
import {RootStackParamList} from "../../../types"

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
    const signedIn = user?.isAnonymous == false
    const googleSignIn = useGoogleSignInPrompt()
    const nav = useNavigation<NavigationProp<RootStackParamList, "SignIn">>()
    const {params} = useRoute<RouteProp<RootStackParamList, "SignIn">>()

    useEffect(() => {
        const unsub = nav.addListener("beforeRemove", () => {
            console.log(`Dismissing sign in screen, signed in: ${signedIn}`)
            params?.complete?.(signedIn)
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
