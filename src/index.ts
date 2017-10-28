import * as Redux from 'redux'
import * as world from "@/store/world"

export type Store = Redux.Store<RootState>

export interface RootState {
    world: world.State
}

const reducers: ReducerOf<RootState> = {
    world: world.reducer
}

const rootReducer = Redux.combineReducers<RootState>(reducers)

declare var window: any
const env: any = window || {}

export function createStore(initialState = {}): Store {
    const comp = Redux.compose(env.devToolsExtension ? env.devToolsExtension() : (f: any) => f) as any
    return Redux.createStore(rootReducer, initialState as RootState, comp)
}

export const store = createStore()

import { init as initPhysicsEngine } from "./game"
import { init as initView } from "./view"

initPhysicsEngine()
initView()
