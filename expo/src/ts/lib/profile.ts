import {useEffect, useState} from "react"
import {fetch} from "./api"
import {useAuth} from "./auth"

export type PublicProfile = {
    id: string,
    uid: string,
    displayName?: string,
    creationDate: Date
}

export const useProfile = (id?: string) => {
    const {user} = useAuth()
    const [profile, setProfile] = useState<PublicProfile>()
    const [querying, setQuerying] = useState(false)

    useEffect(() => {
        if (!user)
            return

        setQuerying(true)
        fetch(id ? `/profile/${id}` : `/profile`)
            .then(res => res.json())
            .then(res => setProfile(res))
            .catch(error => console.error(error))
            .finally(() => setQuerying(false))
    }, [user])

    const update = (payload: any) => {
        setQuerying(true)
        return fetch(id ? `/profile/${id}` : `/profile`, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(payload)
        })
            .then(res => res.json())
            .then(res => console.log(res))
            .catch(error => console.error(error))
            .finally(() => setQuerying(false))
    }

    return {profile, querying, update}
}
