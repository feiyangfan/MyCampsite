import {combineReducers, createAction, createReducer} from "@reduxjs/toolkit"

type AuthWallResultState = {
    done: boolean
    uid: string | null
}
const authWallResult = createReducer<AuthWallResultState>({done: false, uid: null}, builder => {
})

const root = combineReducers({
    authWallResult
})
export default root
