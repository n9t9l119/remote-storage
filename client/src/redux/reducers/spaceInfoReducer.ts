import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface SpaceInfoStateType {
    available_space: number,
    used_space: number,
}

const spaceInfoReducer = createSlice({
    name: 'space-info',
    initialState: {
        available_space: 0,
        used_space: 0
    } as SpaceInfoStateType,
    reducers: {
        setUsedSpace: (state, action:PayloadAction<number>) => {
            state.used_space = action.payload
        },
        setAvailableSpace:(state, action:PayloadAction<number>) =>{
            state.available_space = action.payload
        }
    }
})

export const {setUsedSpace, setAvailableSpace} = spaceInfoReducer.actions

export default spaceInfoReducer.reducer