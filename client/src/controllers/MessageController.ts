import store from "../redux/store";
import {addMessage} from "../redux/reducers/messagesReducer";

export default class MessageController {
    static success(message: string) {
        store.dispatch(addMessage({message, type: "success"}))
    }

    static error(message: string) {
        store.dispatch(addMessage({message, type: "error"}))
    }

    static primary(message: string) {
        store.dispatch(addMessage({message, type: "primary"}))
    }
}