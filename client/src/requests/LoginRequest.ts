import {MethodType, Params} from "../http/RequestInterface";
import BaseRequest from "./BaseRequest";

export interface LoginParams extends Params {
    username: string,
    password: string,
}

export interface LoginResponse {
    access: string,
}

export default class LoginRequest extends BaseRequest {
    method: MethodType = 'post'
    route: string = '/login'
    parameters: LoginParams

    constructor(parameters: LoginParams) {
        super()
        this.parameters = parameters
    }
}