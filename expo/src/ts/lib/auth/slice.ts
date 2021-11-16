import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import {User} from "firebase/auth"

const initialState = {
    listener: false,
    querying: false,
    user: null as User | null,
    authWallActive: false,
}

const slice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        addListener: (state) => {
            if (state.listener)
                return
        },

        signIn: (state, action: PayloadAction<User>) => {
            state.querying = false
            state.user = action.payload
        },

        signOut: (state) => {
            state.querying = false
            state.user = null
        },

        setQuerying: (state) => {
            state.querying = true
        },

        setAuthWallActive: (state, action: PayloadAction<boolean>) => {
            state.authWallActive = action.payload
        }
    }
})
export default slice
