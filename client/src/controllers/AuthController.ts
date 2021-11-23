import LoginRequest, {LoginParams, LoginResponse} from "../requests/LoginRequest";
import RegisterRequest, {RegisterParams, RegisterResponse} from "../requests/RegisterRequest";
import RequestController from "./RequestController";
import store from "../redux/store";
import {login, logout} from "../redux/reducers/authReducer";
import MessageController from "./MessageController";
import LogoutRequest from "../requests/LogoutRequest";
import CheckAuthRequest from "../requests/CheckAuthRequest";
import {appEndLoading, appStartLoading} from "../redux/reducers/appReducer";

export default class AuthController {
    static async login(params: LoginParams) {
        store.dispatch(appStartLoading())
        const command = new RequestController<LoginResponse>(new LoginRequest(params))
        const result = await command.execute()

        if (result.status === 200) {
            localStorage.setItem('accessToken', result.data.access)
            store.dispatch(login())
            MessageController.success('Успешный вход')
        } else if (result.response && result.response.status !== 500) {
            MessageController.error(result.response.data.error)
        }
        store.dispatch(appEndLoading())
    }

    static async register(params: RegisterParams) {
        store.dispatch(appStartLoading())
        const command = new RequestController<RegisterResponse>(new RegisterRequest(params))
        const result = await command.execute()

        if (result.status === 200) {
            localStorage.setItem('accessToken', result.data.access)
            store.dispatch(login())
            MessageController.success('Успешная регистрация')
        } else if (result.response && result.response.status !== 500) {
            MessageController.error(result.response.data.error)
        }
        store.dispatch(appEndLoading())
    }

    static async logout(managed?: boolean) {
        store.dispatch(appStartLoading())
        const command = new RequestController(new LogoutRequest())
        const result = await command.execute()

        if (result.status === 200) {
            localStorage.removeItem('accessToken')
            store.dispatch(logout())
            if (managed) MessageController.primary('Произведен выход из системы')
        } else if (result.response && result.response.status !== 500) {
            MessageController.error(result.response.data.error)
        }
        store.dispatch(appEndLoading())
    }

    static async checkAuth() {
        const command = new RequestController(new CheckAuthRequest())
        const result = await command.execute()

        if (result.status === 200) {
            store.dispatch(login())
        }
    }
}