import {createSlice} from "@reduxjs/toolkit";

export interface AuthStateType {
    isAuth: boolean
}

const authSlice = createSlice({
    name: 'authenticate',
    initialState: {
        isAuth: false,
    } as AuthStateType,
    reducers: {
        login: state => {
            state.isAuth = true
        },

        logout: state => {
            state.isAuth = false
        }
    }
})

export default authSlice.reducer

export const {logout, login} = authSlice.actions