import React, {useEffect, useState} from "react"
import {View} from "react-native"
import {Button, Input, Card} from "react-native-elements"
import {usePasswordSignIn, useGoogleSignInPrompt, useUser} from "../lib/auth"
import {NavigationProp, useNavigation} from "@react-navigation/native"
import {RootStackParamList} from "../types"
import {useAppDispatch} from "../lib/store"
import authSlice from "../lib/auth/slice"

const SignIn = () => {
    const [user] = useUser()
    const nav = useNavigation<NavigationProp<RootStackParamList, "SignIn">>()
    const dispatch = useAppDispatch()
    const googleSignIn = useGoogleSignInPrompt()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const {passwordSignIn, resetPassword} = usePasswordSignIn()

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

    useEffect(() => {
        if (user?.isAnonymous == false)
            nav.goBack()
    })

    return (
        <View>
            <Card>
                <Card.Title>Sign In with Email</Card.Title>
                <Card.Divider />
                <Input placeholder="Email" onChangeText={setEmail} />
                <Input placeholder="Password" onChangeText={setPassword} secureTextEntry />
                <Button title="Sign In using Email" onPress={() => passwordSignIn(email, password)} />
                <Button title="Reset Password" onPress={() => resetPassword(email)} />
            </Card>
            <Card>
                <Card.Title>Or</Card.Title>
                <Card.Divider />
                <View style={{height: 100, justifyContent: "space-between"}}>
                    <Button title="Sign In with Google" onPress={() => googleSignIn()} />
                    <Button title="Sign In with Facebook" onPress={() => {}} />
                </View>
            </Card>
        </View>
    )
}
export default SignIn
