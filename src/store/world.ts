import * as redux from 'redux'
import { eq, actionCreatorFactory } from "@/typedActions"

const actionCreator = actionCreatorFactory('world')

export namespace Trex {
    const actionCreator = actionCreatorFactory('world.trex')
    export const update = actionCreator<Trex>('update')
    export const jump = actionCreator<Trex>('jump')
}

export const addObjects = actionCreator<Entity[]>('addObjects')
export const updateObjects = actionCreator<Entity[]>('updateObjects')

export type State = World

const initialState: World = {
    t: 0,
    dt: 1000 / 10,
    objects: [],
    maxView: { x: 0, y: 0, width: 300, height: 100 }
}

export function reducer(state = initialState, action: redux.Action): State {
    if (eq(action, Trex.jump)) {
        const trex: Trex = { ...action.payload, jumpStartT: state.t, jumpStartX: state.trex.location.x }
        return { ...state, trex }
    }
    if (eq(action, Trex.update))
        return { ...state, trex: action.payload, t: state.t + state.dt }
    if (eq(action, addObjects))
        return { ...state, objects: [...state.objects, ...action.payload] }
    if (eq(action, updateObjects))
        return { ...state, objects: action.payload }
    return state
}
