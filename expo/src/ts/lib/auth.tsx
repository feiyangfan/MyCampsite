import {User, getAuth, onAuthStateChanged, signInWithCredential, AuthCredential, GoogleAuthProvider} from "firebase/auth"
import {useEffect, useState} from "react"
import * as Google from "expo-auth-session/providers/google"
import {expoAuthConfig} from "./config"
import {NavigationProp, useNavigation} from "@react-navigation/native"
import {RootStackParamList} from "../types"

export const useUser = (): [User | null, boolean] => {
    const auth = getAuth()
    const [ready, setReady] = useState(false)
    const [user, setUser] = useState(auth.currentUser)

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

    return [user, ready]
}

export enum AuthWallAction {
    accepted = "accepted",
    pending = "pending",
    rejected = "rejected",
    deferred = "deferred"
}

export const useAuthWall = (presentImmediately = false): [User | null, AuthWallAction, () => void] => {
    const nav = useNavigation<NavigationProp<RootStackParamList, "SignIn">>()
    const [user, ready] = useUser()
    const [presented, setPresented] = useState(false)
    const [waitForUpdate, setWaitForUpdate] = useState(false)
    const [deferred, setDeferred] = useState(true)
    const signedIn = user?.isAnonymous == false
    let action = AuthWallAction.pending
    if (ready && !presented) {
        if (!signedIn) {
            if (deferred)
                action = AuthWallAction.deferred
            else
                action = AuthWallAction.rejected
        } else
            action = AuthWallAction.accepted
    }

    const present = () => {
        setPresented(true)
        if (deferred)
            setDeferred(false)
        nav.navigate("SignIn", {
            complete: (success) => {
                if (success)
                    setWaitForUpdate(true)
                else
                    setPresented(false)
            }
        })
    }

    useEffect(() => {
        if (presented && waitForUpdate && signedIn) {
            setWaitForUpdate(false)
            setPresented(false)
        }
    })

    useEffect(() => {
        if (presentImmediately)
            present()
    }, [])

    return [user, action, present]
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
