import {User, getAuth, onAuthStateChanged, signInWithCredential, AuthCredential, GoogleAuthProvider} from "firebase/auth"
import {useEffect, useState} from "react"
import * as Google from "expo-auth-session/providers/google"
import {expoAuthConfig} from "./config"
import {NavigationProp, useNavigation} from "@react-navigation/native"
import {RootStackParamList} from "../types"
import {useRootSelector} from "./store"

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
    accepted = "accepted",      // signed in
    pending = "pending",        // authenticating
    rejected = "rejected",      // sign in refused
    deferred = "deferred"       // not signed in, auth wall not shown
}

export const useAuthWall = (presentImmediately = false): [User | null, AuthWallAction, () => void] => {
    const nav = useNavigation<NavigationProp<RootStackParamList, "SignIn">>()
    const [user, ready] = useUser()
    const [action, setAction] = useState(AuthWallAction.pending)
    const [deferred, setDeferred] = useState(true)
    const result = useRootSelector(state => state.authWallResult)

    const present = () => {
        setAction(AuthWallAction.pending)
        setDeferred(false)
        nav.navigate("SignIn")
    }

    useEffect(() => {
        if (result.done) {
            if (result.uid == user?.uid)
                setAction(AuthWallAction.accepted)
            else if (!result.uid)
                setAction(AuthWallAction.rejected)
        }
        else if (ready) {
            if (user)
                setAction(AuthWallAction.accepted)
            else if (deferred)
                setAction(AuthWallAction.deferred)
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
