import Request, {MethodType} from "./RequestInterface";
import axios, {AxiosResponse, AxiosInstance} from "axios";
import {DESTINATION_HOST} from "../utils/consts";

export default class RequestController<T> {
    private readonly method: MethodType
    private command: Request
    private axios: AxiosInstance
    private callback: () => void | undefined

    constructor(request: Request, callback?: any) {
        this.method = request.method
        this.command = request
        this.callback = callback
        this.axios = axios.create({
            withCredentials: true,
            baseURL: DESTINATION_HOST + '/api/v1',
        })
    }

    async execute(): Promise<AxiosResponse<T>> {
        if (this.method === 'post') {
            return this.axios.post<T>(this.command.route, this.command.getParameters())
        } else {
            return this.axios.get<T>(this.command.route, this.command.getParameters())
        }
    }

}