import {configureStore} from "@reduxjs/toolkit";
import {combineReducers} from "redux";
import appSlice from "./reducers/appReducer";
import authReducer from "./reducers/authReducer";
import messagesReducer from "./reducers/messagesReducer";
import fileSystemReducer from "./reducers/fileSystemReducer";
import nameWindowReducer from "./reducers/nameWindowReducer";
import fileSystemInteractionReducer from "./reducers/fileSystemInteractionReducer";

const rootReducer = combineReducers({
    app: appSlice,
    auth: authReducer,
    messages: messagesReducer,
    fileSystem: fileSystemReducer,
    nameWindow: nameWindowReducer,
    fileSystemInteraction: fileSystemInteractionReducer
})

const store = configureStore({
    reducer: rootReducer,
    devTools: process.env.NODE_ENV === 'development',
})

export default store

export type MainStateType = ReturnType<typeof store.getState>
export type MainDispatchType = typeof store.dispatch