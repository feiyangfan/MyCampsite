import {useEffect, useState} from "react"
import {fetchJSON} from "./api"
import {useAuth} from "./auth"

export type PrivateProfile = {
    email?: string,
    emailVerified?: boolean
}
export type PublicProfile = {
    id: string,
    uid: string,
    displayName?: string,
    profilePicURL?: string,
    creationDate: Date,
    private?: PrivateProfile,
    admin: boolean
}

export const useProfile = (id?: string) => {
    const {user} = useAuth()
    const [profile, setProfile] = useState<PublicProfile>()
    const [querying, setQuerying] = useState(false)
    const url = id ? `/profile/${id}` : `/profile`

    useEffect(() => {
        if (!user)
            return

        setQuerying(true)
        fetchJSON(url)
            .then(res => setProfile(res))
            .catch(error => console.error(error))
            .finally(() => setQuerying(false))
    }, [user])

    const update = (payload: any) => {
        setQuerying(true)
        return fetchJSON(url, "POST", payload)
            .then(res => console.log(res))
            .catch(error => console.error(error))
            .finally(() => setQuerying(false))
    }

    return {value: profile, querying, update}
}
