import * as redux from 'redux'
import { eq, actionCreatorFactory } from "@/typedActions"

export namespace Trex {
    const actionCreator = actionCreatorFactory('world.trex')
    export const init = actionCreator<RigidBody>('init')
    export const update = actionCreator<RigidBody>('update')
    export const jump = actionCreator<RigidBody>('jump')
}

export type State = World

const initialState: World = {
    board: [],
    width: 300,
    height: 100
}

export function reducer(state = initialState, action: redux.Action): State {
    if (eq(action, Trex.init) || eq(action, Trex.update) || eq(action, Trex.jump))
        return { ...state, trex: action.payload }

    return state
}
