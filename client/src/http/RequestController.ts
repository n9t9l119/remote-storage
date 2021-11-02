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
        this.axios = this.axiosInstanceCreate()
    }

    async execute(): Promise<AxiosResponse<T>> {
        if (this.method === 'post') {
            return this.axios.post<T>(this.command.route, this.command.getParameters())
        } else {
            return this.axios.get<T>(this.command.route, this.command.getParameters())
        }
    }

    axiosInstanceCreate(): AxiosInstance {
        const axiosInstance = axios.create({
            baseURL: DESTINATION_HOST + '/api/v1',
        })

        axiosInstance.interceptors.request.use((config) => {
            const token = localStorage.getItem('accessToken');
            if (config.headers && token) config.headers.Authorization = `JWT ${token}`
            return config
        })

        axiosInstance.interceptors.response.use((config) => {
                return config
            }, async (error) => {
                const originRequest = error.config
                if (error.response.status === 401 && error.config && originRequest._isFirstRetry) {
                    originRequest._isFirstRetry = true
                    try {
                        const response = await axios.get<{ accessToken: string }>(`${DESTINATION_HOST}/refresh/`)
                        localStorage.setItem('accessToken', response.data.accessToken)
                        return axiosInstance.request(originRequest)
                    } catch (e) {
                        console.log('Не авторизован')
                    }
                }
                throw error
            }
        )

        return axiosInstance
    }
}