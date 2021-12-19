export type MethodType = "get" | "post"
export type Params = { [key: string]: number | string | boolean }

export default interface Request {
    method: MethodType,
    route: string,
    parameters?: Params,
    queryParams: boolean,

    binaryData?: ArrayBuffer,
    haveBinaryData: boolean

    getParameters: () => Params | {}
    getBinaryData: () => ArrayBuffer | undefined
    getRoute: () => string

}