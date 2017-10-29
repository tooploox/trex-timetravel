import { Action as ReduxAction } from "redux"

// Simplified version of npm pacakage redux-typescript-actions

export function eq<TPayload>(action: ReduxAction, actionCreator: IActionCreator<TPayload>):
    action is IAction<TPayload> {
    return action.type === actionCreator.type
}

export function actionCreatorFactory(prefix?: string,
    defaultIsError: (payload: any) => boolean = p => p instanceof Error): IActionCreatorFactory {
    const base = prefix ? prefix + '.' : ''
    const actionCreator = <P = void>(
        type: string,
        commonMeta?: Trex,
        isError: ((payload: P) => boolean) | boolean = defaultIsError) => {
        const fullType = base + type

        return (Object as any).assign((payload: P, meta?: Trex) => {
            const action: IAction<P> = {
                type: fullType,
                payload
            }

            if (commonMeta || meta)
                action.meta = (Object as any).assign({}, commonMeta, meta)

            if (isError && (typeof isError === 'boolean' || isError(payload)))
                action.error = true

            return action
        }, { type: fullType }) as IActionCreator<P>
    }

    const asyncActionCreators = <TPayload, TSuccess, TError>(type: string, commonMeta?: Trex) => {
        return {
            type: base + type,
            started: actionCreator<TPayload>(`${type}.STARTED`, commonMeta, false),
            done: actionCreator<TSuccess>(`${type}.DONE`, commonMeta, false),
            failed: actionCreator<TError>(`${type}.FAILED`, commonMeta, true),
        } as IAsyncActionCreators<TPayload, TSuccess, TError>
    }

    return (Object as any).assign(actionCreator, { async: asyncActionCreators }) as IActionCreatorFactory
}
export const actionCreator = actionCreatorFactory()
