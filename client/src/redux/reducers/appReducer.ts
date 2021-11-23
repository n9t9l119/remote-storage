import {createSlice} from "@reduxjs/toolkit";

export interface AppStateType {
    waiting: boolean,
    loading: boolean,
}

const appSlice = createSlice({
    name: 'application',
    initialState: {
        waiting: false,
        loading: false
    } as AppStateType,
    reducers: {
        appStartWaiting: state => {
            state.waiting = true
        },
        appEndWaiting: state => {
            state.waiting = false
        },
        appStartLoading: state => {
            state.loading = true
        },
        appEndLoading: state => {
            state.loading = false
        }
    }
})

export default appSlice.reducer

export const {appStartWaiting, appEndWaiting, appStartLoading, appEndLoading} = appSlice.actions

