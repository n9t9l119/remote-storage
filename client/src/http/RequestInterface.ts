export type MethodType = "get" | "post"
export type Params = { [key: string]: number | string | boolean}


export default interface Request {
    method: MethodType,
    route: string,
    parameters?: Params,
    quarryParams: boolean

    getParameters: () => Params | {}
    getRoute: () => string
}