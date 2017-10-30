import * as Redux from 'redux'
import * as world from "./store"
import { init as initGame } from "./game"

export type Store = Redux.Store<RootState>
export interface RootState { world: world.State }

const reducers: ReducerOf<RootState> = { world: world.reducer }
const rootReducer = Redux.combineReducers<RootState>(reducers)
const env: any = window || {}
const comp = Redux.compose(env.devToolsExtension ? env.devToolsExtension() : (f: any) => f) as any

export const store = Redux.createStore(rootReducer, {} as RootState, comp)

initGame()
