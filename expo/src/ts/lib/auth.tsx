import {getAuth, onAuthStateChanged, signInWithCredential, AuthCredential, GoogleAuthProvider} from "firebase/auth"
import {useEffect, useState} from "react"
import * as Google from "expo-auth-session/providers/google"
import {expoAuthConfig} from "./config"
import {NavigationProp, useNavigation} from "@react-navigation/native"
import {RootStackParamList} from "../../../types"

export const useUser = (shouldNavigate = false) => {
    const auth = getAuth()
    const [ready, setReady] = useState(false)
    const [user, setUser] = useState(auth.currentUser)
    const {navigate} = useNavigation<NavigationProp<RootStackParamList>>()

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, newUser => {
            console.log(`Auth state changed: ${newUser?.uid}
                        anonymous: ${newUser?.isAnonymous}
                        provider: ${newUser?.providerId}`)
            setUser(newUser)
            if (!ready)
                setReady(true)
        })
        return () => unsub()
    }, [])

    useEffect(() => {
        if (ready && shouldNavigate && !user)
            navigate("SignIn")
    })

    return [user, ready]
}

const signInFromProvider = (cred: AuthCredential) => {
    signInWithCredential(getAuth(), cred)
        .then(cred => console.log(`Firebase sign in response: ${cred.operationType}`))
}

export const useGoogleSignInPrompt = () => {
    const [, res, prompt] = Google.useIdTokenAuthRequest(expoAuthConfig.google)

    useEffect(() => {
        console.log(`Google OAuth response: ${res?.type}`)
        if (res?.type == "success")
            signInFromProvider(GoogleAuthProvider.credential(res.params.id_token))
    }, [res])

    return prompt
}
