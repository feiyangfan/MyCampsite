import {User, getAuth, onAuthStateChanged, signOut as firebaseSignOut, signInWithCredential, AuthCredential,
        GoogleAuthProvider, fetchSignInMethodsForEmail, createUserWithEmailAndPassword, sendPasswordResetEmail,
        signInWithEmailAndPassword, sendEmailVerification} from "firebase/auth"
import {useEffect, useState} from "react"
import {NavigationProp, useNavigation} from "@react-navigation/native"
import * as Google from "expo-auth-session/providers/google"
import {expoAuthConfig} from "../config"
import {RootStackParamList} from "../../types"
import {useAppDispatch, useAppSelector} from "../store"
import authSlice from "./slice"

/**
 * Current firebase user, user value is only valid when ready is true
 */
export const useUser = (): [User | null, boolean] => {
    const auth = getAuth()
    const [ready, setReady] = useState(false)
    const [user, setUser] = useState(auth.currentUser)

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, newUser => {
            console.log(`onAuthStateChanged uid: ${newUser?.uid}, anonymous: ${newUser?.isAnonymous}, ` +
                        `provider: ${newUser?.providerId}, verified: ${newUser?.emailVerified}`)
            setUser(newUser)
            if (!ready)
                setReady(true)
        })
        return () => unsub()
    }, [])

    return [user, ready]
}

export enum AuthWallAction {
    accepted,      // signed in
    pending,       // authenticating
    rejected,      // sign in refused
    deferred       // not signed in, auth wall not shown
}

/**
 * Hooks current user and auth wall interaction
 * @param presentImmediately present the auth wall right away without needing to call present
 * @return user: the current firebase user
 * @return authWallAction: auth wall decision
 * @return signIn/signOut: present the auth wall or sign out
 */
export const useAuthWall = (presentImmediately = false) => {
    const auth = getAuth()
    const nav = useNavigation<NavigationProp<RootStackParamList, "SignIn">>()
    const [user, ready] = useUser()
    const [deferred, setDeferred] = useState(true)
    const state = useAppSelector(state => state.auth)
    const dispatch = useAppDispatch()

    let action = AuthWallAction.pending
    if (ready && !state.authWallActive) {
        if (state.requiredUID && state.requiredUID == user?.uid)
            action = AuthWallAction.accepted
        else if (user?.isAnonymous == false)
            action = AuthWallAction.accepted
        else if (deferred)
            action = AuthWallAction.deferred
        else
            action = AuthWallAction.rejected
    }

    const signIn = () => {
        setDeferred(false)
        nav.navigate("SignIn")
    }

    const signOut = () => {
        firebaseSignOut(auth)
        dispatch(authSlice.actions.signOut())
    }

    useEffect(() => {
        if (presentImmediately)
            signIn()
    }, [])

    return {user, authWallAction: action, signIn, signOut}
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

export const usePasswordSignIn = () => {
    const auth = getAuth()

    const passwordSignIn = async (email: string, password: string) => {
        const methods = await fetchSignInMethodsForEmail(auth, email)
        if (methods.length == 0) {
            const {user} = await createUserWithEmailAndPassword(auth, email, password)
            return await sendEmailVerification(user)
        }
        else {
            return await signInWithEmailAndPassword(auth, email, password)
        }
    }

    const resetPassword = (email: string) => {
        return sendPasswordResetEmail(auth, email)
    }

    return {passwordSignIn, resetPassword}
}
