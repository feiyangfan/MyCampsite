import {useEffect, useState} from "react"
import {fetch} from "./api"

export type PublicProfile = {
    id: string,
    uid: string,
    displayName?: string,
    creationDate: Date
}

export const useProfile = (id?: string): [(PublicProfile | null), boolean] => {
    const [valid, setValid] = useState(false)
    const [profile, setProfile] = useState(null)

    useEffect(() => {
        fetch(id ? `/profile/${id}` : `/profile`)
            .then(res => res.json())
            .then(res => setProfile(res))
            .then(() => setValid(true))
            .catch(error => console.error(error))
    })

    return [profile, valid]
}
