import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import {User} from "firebase/auth"

type AuthWallResponse = {
    done: boolean
    uid: User["uid"] | null
}

const initialState = {
    authWallResponse: {done: false, uid: null} as AuthWallResponse
}

const slice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAuthWallResponse: (state, action: PayloadAction<AuthWallResponse>) => {
            state.authWallResponse = action.payload
        },

        resetAuthWallResponse: (state) => {
            state.authWallResponse = initialState.authWallResponse
        }
    }
})
export default slice
