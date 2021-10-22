import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import {User} from "firebase/auth"

const initialState = {
    authWallActive: false,
    requiredUID: null as User["uid"] | null
}

const slice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        presentAuthWall: (state) => {
            state.authWallActive = true
            state.requiredUID = null
        },

        dismissAuthWall: (state, action: PayloadAction<User["uid"] | null>) => {
            state.authWallActive = false
            state.requiredUID = action.payload
        },

        signOut: (state) => {
            state.requiredUID = null
        }
    }
})
export default slice
