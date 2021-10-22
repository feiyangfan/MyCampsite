import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import {User} from "firebase/auth"

const initialState = {
    authWall: {
        presented: false,
        uid: null as User["uid"] | null
    }
}

const slice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        presentAuthWall: (state) => {
            state.authWall.presented = true
            state.authWall.uid = null
        },

        dismissAuthWall: (state, action: PayloadAction<User["uid"] | null>) => {
            state.authWall.presented = false
            state.authWall.uid = action.payload
        }
    }
})
export default slice
