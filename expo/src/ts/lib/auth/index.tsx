import {getAuth, onAuthStateChanged, signOut as firebaseSignOut, signInWithCredential, AuthCredential,
        GoogleAuthProvider, fetchSignInMethodsForEmail, createUserWithEmailAndPassword, sendPasswordResetEmail,
        sendEmailVerification, EmailAuthProvider, FacebookAuthProvider} from "firebase/auth"
import {useEffect, useState} from "react"
import {NavigationProp, useNavigation} from "@react-navigation/native"
import * as Google from "expo-auth-session/providers/google"
import * as Facebook from "expo-auth-session/providers/facebook"
import {expoAuthConfig} from "../config"
import {RootStackParamList} from "../../types"
import {useAppDispatch, useAppSelector} from "../store"
import authSlice from "./slice"

export const useAuth = () => {
    const firebaseAuth = getAuth()
    const global = useAppSelector(state => state.auth)
    const dispatch = useAppDispatch()

    const addListener = () =>
        onAuthStateChanged(firebaseAuth, user => {
            if (user)
                dispatch(authSlice.actions.signIn(user))
            else
                dispatch(authSlice.actions.signOut())
        })

    const providerSignIn = async (cred: AuthCredential) => {
        dispatch(authSlice.actions.setQuerying())
        try {
            const {operationType, providerId, user} = await signInWithCredential(firebaseAuth, cred)
            console.log(`Firebase sign in: ${providerId}, op: ${operationType}, uid: ${user.uid}, verified: ${user.emailVerified}`)
        }
        catch (error) {
            console.error(error)
            dispatch(authSlice.actions.signOut())
        }
    }

    const passwordSignIn = async (email: string, password: string) => {
        dispatch(authSlice.actions.setQuerying())
        try {
            const methods = await fetchSignInMethodsForEmail(firebaseAuth, email)
            if (methods.length == 0) {
                const {user} = await createUserWithEmailAndPassword(firebaseAuth, email, password)
                await sendEmailVerification(user)
                console.log(`Firebase password sign up: ${user.uid}, email: ${user.email}`)
            }
            else
                await providerSignIn(EmailAuthProvider.credential(email, password))
        }
        catch (error) {
            console.error(error)
            dispatch(authSlice.actions.signOut())
        }
    }

    const signOut = async () => {
        console.log(`Signing out: ${global.user?.email}`)
        await firebaseSignOut(firebaseAuth)
    }

    return {addListener, providerSignIn, passwordSignIn, signOut, user: global.user, querying: global.querying}
}

/**
 * accept - the user is logged in <br>
 * wait - querying auth status <br>
 * reject - the user should be locked out <br>
 * defer - the user is not authenticated, but don't warn them yet <br>
 */
export enum AuthWallAction {
    accept,
    wait,
    reject,
    defer
}

/**
 * Hooks current user and auth wall interaction
 * @param presentImmediately present the auth wall right away without needing to call present
 * @return authWallAction: auth wall decision
 * @return present: present the auth wall
 */
export const useAuthWall = (presentImmediately = false): [AuthWallAction, () => void] => {
    const nav = useNavigation<NavigationProp<RootStackParamList, "SignIn">>()
    const [defer, setDefer] = useState(true)
    const auth = useAuth()
    const global = useAppSelector(state => state.auth)

    const present = () => {
        setDefer(false)
        nav.navigate("SignIn")
    }

    useEffect(() => {
        if (presentImmediately)
            present()
    }, [])

    let action
    if (auth.user?.isAnonymous == false)
        action = AuthWallAction.accept
    else if (auth.querying || global.authWallActive)
        action = AuthWallAction.wait
    else if (defer)
        action = AuthWallAction.defer
    else
        action = AuthWallAction.reject

    return [action, present]
}

export const useGoogleSignIn = () => {
    const [req, res, prompt] = Google.useIdTokenAuthRequest(expoAuthConfig.google)
    const {providerSignIn} = useAuth()

    useEffect(() => {
        console.log(`Google OAuth response: ${res?.type}`)
        if (res?.type == "success")
            providerSignIn(GoogleAuthProvider.credential(res.params.id_token))
    }, [res])

    return req ? prompt : null
}

export const useFacebookSignIn = () => {
    const [req, res, prompt] = Facebook.useAuthRequest(expoAuthConfig.facebook)
    const {providerSignIn} = useAuth()

    useEffect(() => {
        console.log(`Facebook OAuth response: ${res?.type}`)
        if (res?.type == "success")
            providerSignIn(FacebookAuthProvider.credential(res.params.access_token))
    }, [res])

    return req ? prompt : null
};

export const usePasswordSignIn = () => {
    const firebaseAuth = getAuth()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const {passwordSignIn} = useAuth()

    const signIn = () => {
        return passwordSignIn(email, password)
    }

    const forgot = () => {
        return sendPasswordResetEmail(firebaseAuth, email)
    }

    return {signIn, forgot, onChangeText: {email: setEmail, password: setPassword}}
}
