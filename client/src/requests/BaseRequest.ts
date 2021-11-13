import Request, {MethodType, Params} from "../http/RequestInterface";

export default class BaseRequest implements Request {
    route: string = '';
    parameters?: Params | undefined;
    method: MethodType = 'get';

    getParameters(){
        if(this.parameters) return this.parameters
        return {}
    };

}