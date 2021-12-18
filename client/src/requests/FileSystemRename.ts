import BaseRequest from "./BaseRequest";
import {MethodType, Params} from "../http/RequestInterface";

export interface FSRenameParams extends Params {
    id: string,
    new_name: string
}

export default class FileSystemRename extends BaseRequest {
    method: MethodType = 'post'
    route: string = 'filesystem/rename'
    parameters: FSRenameParams
    queryParams: boolean = true

    constructor(parameters: FSRenameParams) {
        super();
        this.parameters = parameters
    }
}