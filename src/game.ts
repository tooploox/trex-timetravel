import { store } from "./index"
import * as world from './store/world'
import * as view from './view'
import { update, Vector, RigidBody, Size, applyImpulse, Rect } from "./physicsEngine"

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
    if (state.t - trex.jumpT < state.dt * 20)
        store.dispatch(world.Trex.update(applyImpulse(trex, Vector(0, 800))))
    else if (trex.location.y === 0)
        store.dispatch(world.Trex.jump(applyImpulse(trex, Vector(0, 4000))))
}

export function init() {
    const G = Vector(0, -9810)
    const trex: Entity = {
        ...RigidBody(10, Vector(0, 0), Vector(90, 0), [G]),
        size: Size(44, 47),
        shape: [
            Rect(11, 15, 17, 26), // body
            Rect(2, 17, 9, 18), // tail
            Rect(20, 1, 22, 15), // head
            Rect(14, 20, 20, 4) // hand
        ]
    }

    store.dispatch(world.Trex.init(trex))
    view.init()
    setInterval(recalculate, 1000 / store.getState().world.dt)
}

