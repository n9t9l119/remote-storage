import BaseRequest from "./BaseRequest";
import {Params, MethodType} from "../http/RequestInterface";

export type FSFileUploadData = ArrayBuffer

export interface FSFileUploadParams extends Params {
    filename: string,
    parent_id: string,
}

export interface FSFileUploadResponse {
    id: string,
    name: string | null,
    objects: FSObject[],
    owner: string,
    parent_id: string | null
}

interface FSObject {
    creation_date: number,
    id: string,
    name: string,
    owner_id: string,
    owner_name: string,
    type: 'folder' | 'file'
}

export default class FileSystemUploadFile extends BaseRequest {
    method: MethodType = 'post'
    route: string = 'filesystem/upload_file'
    parameters: FSFileUploadParams
    queryParams: boolean = true
    haveBinaryData: boolean = true
    binaryData: ArrayBuffer

    constructor(parameters: FSFileUploadParams, requestBody: ArrayBuffer) {
        super();
        this.parameters = parameters
        this.binaryData = requestBody
    }

}