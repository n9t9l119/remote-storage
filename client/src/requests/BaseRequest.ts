import Request, {MethodType, Params} from "../http/RequestInterface";

export default class BaseRequest implements Request {
    route: string = '';
    parameters?: Params | undefined;
    method: MethodType = 'get';
    quarryParams: boolean = false;

    getParameters() {
        if (this.parameters) return this.parameters
        return {}
    };

    getRoute() {
        if (this.parameters && Object.keys(this.parameters).length && this.quarryParams) {
            let quarryStr = ''
            for (const [key, value] of Object.entries(this.parameters)) {
                if (value.toString().trim())
                    quarryStr += `${key}=${value}&`
            }
            return `${this.route}?${quarryStr.substr(0, quarryStr.length - 1)}`
        }
        return this.route
    }
}