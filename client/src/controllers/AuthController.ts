import LoginRequest, {LoginParams, LoginResponse} from "../requests/LoginRequest";
import RegisterRequest, {RegisterParams, RegisterResponse} from "../requests/RegisterRequest";
import RequestController from "../http/RequestController";
import store from "../redux/store";
import {login} from "../redux/reducers/authReducer";
import MessageController from "./MessageController";

export default class AuthController {
    static async login(params: LoginParams) {
        const command = new RequestController<LoginResponse>(new LoginRequest(params))
        const result = await command.execute()

        if (result.status === 200) {
            localStorage.setItem('accessToken', result.data.access)
            store.dispatch(login())
            MessageController.success('Успешный вход')
        } else if (result.response && result.response.status !== 500) {
            MessageController.error(result.response.data.error)
        }
    }

    static async register(params: RegisterParams) {
        const command = new RequestController<RegisterResponse>(new RegisterRequest(params))
        const result = await command.execute()

        if (result.status === 200) {
            localStorage.setItem('accessToken', result.data.access)
            store.dispatch(login())
            MessageController.success('Успешная регистрация')
        } else if (result.response && result.response.status !== 500) {
            MessageController.error(result.response.data.error)
        }
    }
}