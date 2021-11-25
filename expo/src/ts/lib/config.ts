import {releaseChannel} from "expo-updates"
import {ResponseType} from "expo-auth-session"

let baseURL = "http://10.0.2.2:3000"
if (releaseChannel.startsWith("prod-d2"))
    baseURL = "https://mycampsite-team12.herokuapp.com"
else if (releaseChannel.startsWith("prod-d3"))
    baseURL = "https://mycampsite-team12.herokuapp.com" // TODO change this
export const env = {
    releaseChannel,
    baseURL
}

export const firebaseConfig = {
    apiKey: "AIzaSyB6zqNLSfM2plie9yskADL9HqxGUzMpvsM",
    authDomain: "my-campsite-329022.firebaseapp.com",
}

export const expoAuthConfig = {
    google: {
        expoClientId: "1087026256301-bb4r0q3onn91j0s3a8re86bucd2gv2e0.apps.googleusercontent.com",
        androidClientId: "1087026256301-pk17qjncsrhncbsbaqm170oskncq8b8d.apps.googleusercontent.com"
    },
    facebook: {
        expoClientId: "178836534456775",
        androidClientId: "178836534456775",
        responseType: ResponseType.Token
    }
}
