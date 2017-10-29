///<reference path="./game.d.ts" />

declare module '*.json' {
    const value: any
    export default value
}

declare module '*.scss' {
    const content: any;
    export default content;
}

type SMap<T> = { [s: string]: T }

interface IReducer<T, S> extends IAction<T> {
    reduce: (state: S) => S
}

interface IActionBase { type: string }

interface IAction<TPayload> extends IActionBase {
    type: string
    payload?: TPayload
    error?: boolean
    meta?: Trex
}

interface ISuccess<TPayload, TSuccess> {
    params: TPayload
    result: TSuccess
}

interface IFailure<TPayload, TError> {
    params: TPayload
    error: TError
}

interface IActionCreator<TPayload> {
    type: string
    (payload: TPayload, meta?: Trex): IAction<TPayload>
}

interface IEmptyActionCreator extends IActionCreator<undefined> {
    (payload?: undefined, meta?: Trex): IAction<undefined>;
}

interface IAsyncActionCreators<TPayload, TSuccess, TError> {
    type: string;
    started: IActionCreator<TPayload>;
    done: IActionCreator<TSuccess>;
    failed: IActionCreator<TError>;
}

interface IActionCreatorFactory {
    (type: string, commonMeta?: Trex, error?: boolean):
        IEmptyActionCreator

    <P>(type: string, commonMeta?: Trex, isError?: boolean):
        IActionCreator<P>
    <TPayload>(type: string, commonMeta?: Trex, isError?: (payload: TPayload) => boolean):
        IActionCreator<TPayload>

    async<TPayload, TSuccess>(type: string, commonMeta?: Trex):
        IAsyncActionCreators<TPayload, TSuccess, any>;
    async<TPayload, TSuccess, TError>(type: string, commonMeta?: Trex):
        IAsyncActionCreators<TPayload, TSuccess, TError>;
}

type Reducer<T> = (state: T, action: { type: string }) => T
type Casted<T, S> = {[P in keyof T]: S}
type ReducerOf<T> = Casted<T, Reducer<any>>
