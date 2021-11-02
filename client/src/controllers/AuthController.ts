import LoginRequest, {LoginParams, LoginResponse} from "../requests/LoginRequest";
import RegisterRequest, {RegisterParams, RegisterResponse} from "../requests/RegisterRequest";
import RequestController from "../http/RequestController";

export default class AuthController {
    static async login(params: LoginParams){
        const command = new RequestController<LoginResponse>(new LoginRequest(params))
        const response = await command.execute()
    }

    static async register(params: RegisterParams){
        const command = new RequestController<RegisterResponse>(new RegisterRequest(params))
        const response = await command.execute()
    }
}