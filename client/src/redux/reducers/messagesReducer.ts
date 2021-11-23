import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {MainDispatchType} from "../store";

export interface MessagesStateType {
    messages: MessageType[]
}

interface MessageType {
    message: string,
    type: KindOfMessage,
    cssClass: 'visible' | 'vanishing',
    id: number,
}

type KindOfMessage = 'success' | 'error' | 'primary'

const messagesSlice = createSlice({
    name: 'messages',
    initialState: {
        messages: []
    } as MessagesStateType,
    reducers: {
        addMessage: (state, action: PayloadAction<MessageType>) => {
            state.messages.push(action.payload)
        },
        changeCssClass: (state, action: PayloadAction<number>) => {
            state.messages[state.messages.findIndex(elem => elem.id === action.payload)].cssClass = 'vanishing'
        },
        deleteMessage: (state, action: PayloadAction<number>) => {
            state.messages.splice(state.messages.findIndex(elem => elem.id === action.payload), 1)
        }
    }
})

const addMessage = (data: { message: string, type: KindOfMessage}) => async (dispatch: MainDispatchType) => {
    const id = new Date().getTime();
    dispatch(messagesSlice.actions.addMessage({message: data.message, type: data.type, cssClass: 'visible', id}))
    await new Promise(res => {
        setTimeout(res, 2000)
    })
    dispatch(deleteMessage(id))
}

const deleteMessage = (data: number) => async (dispatch: MainDispatchType) => {
    dispatch(messagesSlice.actions.changeCssClass(data))
    await new Promise(res => {
        setTimeout(res, 1000)
    })
    dispatch(messagesSlice.actions.deleteMessage(data))
}

export default messagesSlice.reducer

export {addMessage, deleteMessage}