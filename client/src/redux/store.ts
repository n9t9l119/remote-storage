import {configureStore} from "@reduxjs/toolkit";
import {combineReducers} from "redux";
import appSlice from "./reducers/appReducer";
import authReducer from "./reducers/authReducer";
import messagesReducer from "./reducers/messagesReducer";

const rootReducer = combineReducers({
    app: appSlice,
    auth: authReducer,
    messages: messagesReducer
})

const store = configureStore({
    reducer: rootReducer,
    devTools: true,
})

export default store

export type MainStateType = ReturnType<typeof store.getState>
export type MainDispatchType = typeof store.dispatch