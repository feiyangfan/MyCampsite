import React, {useEffect} from "react"
import {View} from "react-native"
import {Button, Input, Card} from "react-native-elements"
import {usePasswordSignIn, useGoogleSignIn, useAuthWall, AuthWallAction, useFacebookSignIn} from "../lib/auth"
import {NavigationProp, useNavigation} from "@react-navigation/native"
import {RootStackParamList} from "../types"
import {useAppDispatch} from "../lib/store"
import authSlice from "../lib/auth/slice"

const SignIn = () => {
    const [authWallAction] = useAuthWall()
    const nav = useNavigation<NavigationProp<RootStackParamList, "SignIn">>()
    const dispatch = useAppDispatch()
    const googleSignIn = useGoogleSignIn()
    const facebookSignIn = useFacebookSignIn()
    const passwordSignIn = usePasswordSignIn()

    useEffect(() => {
        dispatch(authSlice.actions.setAuthWallActive(true))
        const unsub = nav.addListener("beforeRemove", () => {
            dispatch(authSlice.actions.setAuthWallActive(false))
        })
        return () => unsub()
    }, [])

    useEffect(() => {
        if (authWallAction == AuthWallAction.accept)
            nav.goBack()
    })

    return (
        <View>
            <Card>
                <Card.Title>Sign In with Email</Card.Title>
                <Card.Divider />
                <Input placeholder="Email" onChangeText={passwordSignIn.onChangeText.email} />
                <Input placeholder="Password" onChangeText={passwordSignIn.onChangeText.password} secureTextEntry />
                <Button title="Sign In using Email" onPress={() => passwordSignIn.signIn()} />
                <Button title="Reset Password" onPress={() => passwordSignIn.forgot()} />
            </Card>
            <Card>
                <Card.Title>Or</Card.Title>
                <Card.Divider />
                <View style={{height: 100, justifyContent: "space-between"}}>
                    <Button title="Sign In with Google" onPress={() => googleSignIn()} />
                    <Button title="Sign In with Facebook" onPress={() => facebookSignIn()} />
                </View>
            </Card>
        </View>
    )
}
export default SignIn
