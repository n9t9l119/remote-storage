import Request, {MethodType} from "../http/RequestInterface";
import axios, {AxiosResponse, AxiosInstance, AxiosError} from "axios";
import {DESTINATION_HOST} from "../utils/consts";
import AuthController from "./AuthController";


interface ErrorType {
    error: string
}

class RequestController<T> {
    private readonly method: MethodType
    private command: Request
    private static axios: AxiosInstance
    private callback: () => void | undefined

    constructor(request: Request, callback?: any) {
        this.method = request.method
        this.command = request
        this.callback = callback

        if (!RequestController.axios) RequestController.axios = this.axiosInstanceCreate()
    }

    async execute(): Promise<AxiosResponse<T> & AxiosError<ErrorType>> {
        if (this.method === 'post') {
            let data = this.command.binaryData ? this.command.getBinaryData() : this.command.getParameters()
            return RequestController.axios.post(this.command.getRoute(), data).catch(reason => reason)
        } else {
            return RequestController.axios.get(this.command.getRoute()).catch(reason => reason)
        }
    }

    private axiosInstanceCreate(): AxiosInstance {
        const axiosInstance = axios.create({
            baseURL: DESTINATION_HOST + '/api/v1',
            withCredentials: true,
            onUploadProgress: (progressEvent) => {
				const totalLength = progressEvent.lengthComputable ? progressEvent.total : progressEvent.target.getResponseHeader('content-length') || progressEvent.target.getResponseHeader('x-decompressed-content-length');
				if (totalLength !== null) {
					console.log(Math.round( (progressEvent.loaded * 100) / totalLength ))
				}
			}
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
                if (error.response.status === 403 && error.config && !originRequest._isFirstRetry) {
                    originRequest._isFirstRetry = true
                    try {
                        const response = await axiosInstance.post<{ access: string }>(`${DESTINATION_HOST}/api/v1/refresh`)
                        localStorage.setItem('accessToken', response.data.access)
                        return axiosInstance.request(originRequest)
                    } catch (e) {
                        console.log('Не авторизован')
                        await AuthController.logout(true)
                    }
                }
                throw error
            }
        )

        return axiosInstance
    }
}

export default RequestController