import {MethodType, Params} from "../http/RequestInterface";
import BaseRequest from "./BaseRequest";

export interface RegisterParams extends Params {
    username: string,
    email: string,
    password: string,
    password2: string,
}

export interface RegisterResponse {
    access: string
}

export default class RegisterRequest extends BaseRequest {
    method: MethodType = "post"
    route: string = "/register"
    parameters: RegisterParams

    constructor(parameters: RegisterParams) {
        super()
        this.parameters = parameters
    }
}