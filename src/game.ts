import { store } from "./index"
import * as world from './store/world'
import * as view from './view'
import { update, Vector, RigidBody, Size, applyImpulse } from "./physicsEngine"

const ms = 1000 / 50
let isPaused = false

export const pause = () => {
    isPaused = !isPaused
}

function recalculate() {
    if (isPaused)
        return
    const worldState = store.getState().world
    const trex = update(worldState.trex, 1 / ms)
    store.dispatch(world.Trex.update(trex))
    view.renderWorld(worldState)
}

export function jump() {
    const trex = store.getState().world.trex
    if (trex.location.y !== 0)
        return
    const newTrex = applyImpulse(trex, Vector(0, 3000))
    store.dispatch(world.Trex.jump(newTrex))
}

export function init() {
    const G = Vector(0, -3000)
    //Rect()
    const trex: Entity = {
        ...RigidBody(12, Vector(0, 0), Vector(10, 0), [G]),
        size: Size(4, 4.272)
    }

    store.dispatch(world.Trex.init(trex))
    view.init()
    setInterval(recalculate, ms)
}

