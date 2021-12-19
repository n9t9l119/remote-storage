import BaseRequest from "./BaseRequest";
import {MethodType, Params} from "../http/RequestInterface";

export interface FSGetParams extends Params {
    id: string
}

export interface FSGetResponse {
    id: string,
    name: string | null,
    objects: FSObject[],
    owner_name: string,
    owner_id: string,
    parent_id: string | null,
    available_space: number,
    used_space: number
}

interface FSObject {
    creation_date: number,
    id: string,
    name: string,
    owner_id: string,
    owner_name: string,
    type: 'folder' | 'file'
}

export default class FileSystemGet extends BaseRequest {
    method: MethodType = 'post'
    route: string = '/filesystem/get'
    queryParams: boolean = true
    parameters: FSGetParams | undefined

    constructor(parameters?: FSGetParams) {
        super();
        this.parameters = parameters
    }


}