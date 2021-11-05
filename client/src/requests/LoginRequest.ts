import Request, {MethodType, Params} from "../http/RequestInterface";

export interface LoginParams extends Params{
    username:string,
    password: string,
}
export interface LoginResponse{
    access: string,
}

export default class LoginRequest implements Request {
    method: MethodType = 'post'
    route: string = '/login/'
    parameters: LoginParams

    constructor(parameters: LoginParams) {
        this.parameters = parameters
    }

    getParameters(): LoginParams {
        return this.parameters
    }

}