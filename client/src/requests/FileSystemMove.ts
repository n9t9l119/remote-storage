import {MethodType, Params} from "../http/RequestInterface";
import BaseRequest from "./BaseRequest";

export interface FSMoveParams extends Params {
    id: string,
    new_parent_id: string
}

export default class FileSystemMove extends BaseRequest {
    method: MethodType = 'post'
    route: string = 'filesystem/move'
    parameters: FSMoveParams
    quarryParams: boolean = true

    constructor(parameters: FSMoveParams) {
        super();
        this.parameters = parameters
    }

}