import Request, {MethodType, Params} from "../http/RequestInterface";

export default class BaseRequest implements Request {
    route: string = '';
    parameters?: Params;
    method: MethodType = 'get';
    queryParams: boolean = false;
    haveBinaryData: boolean = false
    binaryData?: ArrayBuffer


    getParameters() {
        if (this.parameters) return this.parameters
        return {}
    };

    getBinaryData() {
        if (this.haveBinaryData) {
            return this.binaryData
        }
    }

    getRoute() {
        if (this.parameters && Object.keys(this.parameters).length && this.queryParams) {
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