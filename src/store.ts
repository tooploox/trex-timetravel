import * as redux from 'redux'
import { eq, actionCreatorFactory } from "@/typedActions"
import { Trex } from './game'

const actionCreator = actionCreatorFactory('world')

export const trex = {
    update: actionCreator<Trex>('trex.update'),
    jump: actionCreator<Trex>('trex.jump')
}

export const objects = {
    add: actionCreator<Entity[]>('objects.add'),
    update: actionCreator<Entity[]>('objects.update')
}

export const init = actionCreator<World>('init')

export type State = World

const initialState: World = { t: 0, dt: 1000 / 10, objects: [], trex: Trex.create() }

export const recording: World[] = []
export function reducer(state = initialState, action: redux.Action): State {
    if (eq(action, init))
        return action.payload
    recording.push(state)

    if (eq(action, trex.jump)) {
        const trex: Trex = { ...action.payload, jumpStartT: state.t }
        return { ...state, trex }
    }
    if (eq(action, trex.update))
        return { ...state, trex: action.payload, t: state.t + state.dt }
    if (eq(action, objects.add))
        return { ...state, objects: [...state.objects, ...action.payload] }
    if (eq(action, objects.update))
        return { ...state, objects: action.payload }
    return state
}
