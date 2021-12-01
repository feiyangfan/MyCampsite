import {fetchJSON} from "./api"
import {useEffect, useState} from "react"

export type Site = {
    name: string,
    location: object,
    image: string
}

export const useSite = (id: string, park: string) => {
    const [site, setSite] = useState<Site>()
    const [querying, setQuerying] = useState(false)

    useEffect(() => {
        if (!id || !park)
            return

        setQuerying(true)
        fetchJSON(`/location/${park}/site/${id}`)
            .then(site => setSite(site))
            .finally(() => setQuerying(false))
    }, [id, park])

    return {state: site, querying}
}
