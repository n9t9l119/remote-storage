export type MethodType = "get" | "post"
export type Params = { [key: string]: number | string | boolean | undefined}


export default interface Request {
    method: MethodType,
    route: string,
    parameters?: Params

    getParameters: () => Params | {}
}