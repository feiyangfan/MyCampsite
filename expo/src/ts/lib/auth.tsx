import {getAuth, onAuthStateChanged, signInWithCredential, GoogleAuthProvider} from "firebase/auth"
import {useEffect, useState} from "react"
import * as Google from "expo-auth-session/providers/google"
import {expoAuthConfig} from "./config"

export const useUser = () => {
    const auth = getAuth()
    const [user, setUser] = useState(auth.currentUser)

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, newUser => {
            console.log(`Auth state changed: ${newUser?.uid}
                        anonymous: ${newUser?.isAnonymous}
                        provider: ${newUser?.providerId}`)
            setUser(newUser)
        })
        return () => unsub()
    })

    return [user]
}

export const useGoogleSignInPrompt = () => {
    const auth = getAuth()
    const [, res, prompt] = Google.useIdTokenAuthRequest(expoAuthConfig.google)

    useEffect(() => {
        console.log(`Google OAuth response: ${res?.type}`)
        if (res?.type == "success") {
            const cred = GoogleAuthProvider.credential(res.params.id_token)
            signInWithCredential(auth, cred)
                .then(cred => console.log(`Firebase sign in response: ${cred.operationType}`))
        }
    }, [res])

    return prompt
}
