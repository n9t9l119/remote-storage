import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface NameWindowState {
    visible: boolean,
    actionType: WindowType | undefined,
    elementType: ElementType | undefined
}

type WindowType = 'create' | 'rename'
type ElementType = 'folder' | 'file'


const nameWindowReducer = createSlice({
    name: 'nameWindow',
    initialState: {
        visible: false,
        actionType: undefined,
        elementType: undefined
    } as NameWindowState,
    reducers: {
        showNameWindow: (state, action: PayloadAction<{ actionType: WindowType, elementType: ElementType }>) => {
            state.visible = true
            state.actionType = action.payload.actionType
            state.elementType = action.payload.elementType
        },
        closeNameWindow: (state) => {
            state.visible = false
            state.actionType = undefined
            state.elementType = undefined
        }
    }
})

export const {showNameWindow, closeNameWindow} = nameWindowReducer.actions

export default nameWindowReducer.reducer