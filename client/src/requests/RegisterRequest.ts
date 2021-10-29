import Request, {MethodType, Params} from "../http/RequestInterface";

export interface RegisterResponse {
    username: string,
    email: string,
    first_name?: string,
    last_name?: string,
}

interface RegisterParams extends Params{
    username: string,
    email: string,
    password: string,
    password2: string,
    first_name?: string,
    lastname?: string,
}

export default class RegisterRequest implements Request {
    method: MethodType = "post"
    route = "/register/"
    parameters: RegisterParams

    constructor(parameters: RegisterParams) {
        this.parameters = parameters
    }

    getParameters(): RegisterParams {
        return this.parameters
    }
}