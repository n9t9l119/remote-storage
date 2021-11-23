import BaseRequest from "./BaseRequest";
import {MethodType, Params} from "../http/RequestInterface";

export interface FSCreateFolderParams extends Params{
    parent_id: string,
    name: string,
}

export default class FileSystemCreateFolder extends BaseRequest {
    method: MethodType = 'post'
    route: string = 'filesystem/create_folder'
    quarryParams: boolean = true
    parameters: FSCreateFolderParams

    constructor(parameters: FSCreateFolderParams) {
        super();
        this.parameters = parameters
    }
}