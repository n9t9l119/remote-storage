import {createSlice} from "@reduxjs/toolkit";

export interface AppStateType {
    waiting: boolean
}

const appSlice = createSlice({
    name: 'application',
    initialState: {
        waiting: false,
    } as AppStateType,
    reducers: {
        appStartWaiting: state => {
            state.waiting = true
        },
        appEndWaiting: state => {
            state.waiting = false
        }
    }
})

export default appSlice.reducer

export const {appStartWaiting, appEndWaiting} = appSlice.actions

