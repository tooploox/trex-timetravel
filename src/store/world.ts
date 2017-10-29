import * as redux from 'redux'
import { eq, actionCreatorFactory } from "@/typedActions"

const actionCreator = actionCreatorFactory('world')
export namespace Trex {
    const actionCreator = actionCreatorFactory('world.trex')
    export const init = actionCreator<Entity>('init')
    export const update = actionCreator<Entity>('update')
    export const jump = actionCreator<Entity>('jump')
}

export const update = actionCreator<number>('update')

export type State = World

const initialState: World = {
    t: 0,
    dt: 1000 / 10,
    maxView: { x: 0, y: 0, width: 300, height: 100 }
}

export function reducer(state = initialState, action: redux.Action): State {
    if (eq(action, Trex.init) || eq(action, Trex.update) || eq(action, Trex.jump))
        return { ...state, trex: action.payload }
    if (eq(action, update))
        return { ...state, t: action.payload }
    return state
}
