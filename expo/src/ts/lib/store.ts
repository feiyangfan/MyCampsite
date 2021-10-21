import {configureStore} from "@reduxjs/toolkit"
import rootReducer from "./reducers"
import {TypedUseSelectorHook, useDispatch, useSelector} from "react-redux"

const store = configureStore({reducer: rootReducer})
export default store

export type RootState = ReturnType<typeof store.getState>
export const useRootSelector: TypedUseSelectorHook<RootState> = useSelector

export type RootDispatch = typeof store.dispatch
export const useRootDispatch = () => useDispatch<RootDispatch>()
