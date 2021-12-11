import BaseRequest from "./BaseRequest";
import {MethodType, Params} from "../http/RequestInterface";

export interface FSDeleteParams extends Params {
    id: string
}

export default class FileSystemDelete extends BaseRequest {
    method: MethodType = 'post'
    route: string = 'filesystem/delete'
    quarryParams: boolean = true
    parameters: FSDeleteParams

    constructor(parameters: FSDeleteParams) {
        super();
        this.parameters = parameters
    }
}