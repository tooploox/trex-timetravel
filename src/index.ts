import * as Redux from 'redux'
import * as world from "./store/world"
import * as game from "./game"

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

game.init()
