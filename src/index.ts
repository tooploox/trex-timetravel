import * as Redux from 'redux'
import * as app from "@/store/app"
import { actionCreator } from "./typedActions"
export type Store = Redux.Store<IRootState>

export interface IRootState {
    app: app.IState
}

const rootReducer = Redux.combineReducers<IRootState>({ app: app.reducer })

declare var window: any
const env: any = window || {}

export function createStore(initialState = {}): Store {
    const comp = Redux.compose(env.devToolsExtension ? env.devToolsExtension() : (f: any) => f) as any
    return Redux.createStore(rootReducer, initialState as IRootState, comp)
}

const store = createStore()

const someAction = actionCreator.async<number, string, string>('SOME.ACTION')

store.dispatch(someAction.started(1))
store.dispatch(someAction.done("foo"))
