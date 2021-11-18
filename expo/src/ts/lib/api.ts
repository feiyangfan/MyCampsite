import {getAuth} from "firebase/auth"
import {env} from "./config"

const fetchAPI: GlobalFetch["fetch"] = async (input, init?) => {
    switch (typeof input) {
        case "string":
            input = env.baseURL + input
            break
        case "object":
            input = new Request(env.baseURL + input.url, input)
    }

    const idToken = await getAuth().currentUser?.getIdToken(true)
    const headers = new Headers(init?.headers)
    headers.append("X-Firebase-IDToken", idToken ?? "")

    return await fetch(input, {...init, headers})
}
export {fetchAPI as fetch}

export const fetchJSON = (url: string, method = "GET", body = null) => {
    const req: RequestInit = {
        method
    }
    if (body) {
        req.headers = {"Content-Type": "application/json"}
        req.body = JSON.stringify(body)
    }
    return fetchAPI(url, req)
        .then(res => res.json())
}
