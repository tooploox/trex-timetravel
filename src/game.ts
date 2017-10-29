import { store } from "./index"
import * as world from './store/world'
import * as view from './view'
import { update, Vector, RigidBody, Size, applyImpulse, Rect, sum } from "./physicsEngine"

let isPaused = false

export const pause = () => {
    isPaused = !isPaused
}

function recalculate() {
    const state = store.getState().world
    view.renderWorld(state)
    if (isPaused)
        return
    const lastX = state.objects.length === 0 ? 300 : state.objects[state.objects.length - 1].location.x
    const maxW = window.innerWidth
    if (state.trex.location.x + maxW > lastX)
        store.dispatch(world.addStaticObjects(getObjects(lastX + 300)))

    const t = state.t + state.dt
    const trex = update(state.trex, 1 / state.dt)
    store.dispatch(world.Trex.update({ ...trex, velocity: sum(trex.velocity, Vector(.01, 0)) }))
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

function getObjects(xOffset: number) {
    const objects: Trex[] = []
    for (let i = 0; i < window.innerWidth; i++) {
        if (Math.random() * 1000 % 200 >= 1)
            continue
        const object = {
            ...RigidBody(100, Vector(xOffset + i, 0)),
            size: Size(25, 50),
            shape: [
                Rect(0, 12, 9, 32), // left
                Rect(9, 0, 7, 46), // middle
                Rect(19, 11, 5, 20), // right
            ]
        }
        i += object.size.width * 6
        objects.push(object)
    }
    return objects
}

export function init() {
    const G = Vector(0, -9810)

    const trex: Trex = {
        ...RigidBody(10, Vector(0, 0), Vector(130, 0), [G]),
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
