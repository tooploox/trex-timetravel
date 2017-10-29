import { store } from "./index"
import * as world from './store/world'
import * as view from './view'
import { update, Vector, RigidBody, Size, applyImpulse } from "./physicsEngine"

let isPaused = false

export const pause = () => {
    isPaused = !isPaused
}

function recalculate() {
    const state = store.getState().world
    view.renderWorld(state)
    if (isPaused)
        return
    const t = state.t + state.dt
    const trex = update(state.trex, 1 / state.dt)
    store.dispatch(world.Trex.update(trex))
    store.dispatch(world.update(t))
}

export function jump() {
    const state = store.getState().world
    const trex = state.trex
    // jump acceleration
    if (state.t - trex.jumpT < state.dt * 20) {
        const newTrex = applyImpulse(trex, Vector(0, 380))
        store.dispatch(world.Trex.update(newTrex))
        return
    }
    if (trex.location.y !== 0)
        return
    const newTrex = applyImpulse(trex, Vector(0, 1800))
    store.dispatch(world.Trex.jump(newTrex))
}

export function init() {
    const G = Vector(0, -4000)
    const trex: Entity = {
        ...RigidBody(5, Vector(0, 0), Vector(90, 0), [G]),
        size: Size(4, 4.272)
    }

    store.dispatch(world.Trex.init(trex))
    view.init()
    setInterval(recalculate, 1000 / store.getState().world.dt)
}

