import { store } from "./index"
import * as world from '@/store/world'

export const Vector = (x: number, y: number): Vector => ({ x, y })
export const Size = (width: number, height: number): Size => ({ width, height })
export function RigidBody(mass: number, location = Vector(0, 0), velocity = Vector(0, 0),
    forces: Vector[] = []): RigidBody {
    return { mass, location, velocity, forces }
}
const vmap = (v: Vector, f: (v: number) => number) => Vector(f(v.x), f(v.y))
const vmapReduce = (vs: Vector[], f: (v: number) => number) => vmap(vs.reduce((l, r) => sum(l, r), Vector(0, 0)), f)

export function sum(v1: Vector, v2: Vector, v3?: Vector): Vector {
    const result = Vector(v1.x + v2.x, v1.y + v2.y)
    return v3 ? sum(result, v3) : result
}

export const applyForce = (body: RigidBody, force: Vector): RigidBody =>
    ({ ...body, forces: [...(body.forces || []), force] })

export const applyImpulse = (body: RigidBody, impulse: Vector): RigidBody =>
    ({ ...body, impulses: [...(body.impulses || []), impulse] })

export function update(body: RigidBody, deltaTime: number): RigidBody {
    const acceleration = vmapReduce(body.forces || [], v => v / body.mass * deltaTime)
    const impulses = vmapReduce(body.impulses || [], v => v / body.mass)
    const velocity = sum(body.velocity, impulses, acceleration)
    const location = sum(body.location, vmap(velocity, v => v * deltaTime))
    if (location.y < 0) {
        location.y = 0
        velocity.y = 0
    }
    return RigidBody(body.mass, location, velocity, body.forces)
}

const ms = 1000 / 50
let isPaused = false
export const pause = () => {
    console.log("puase")
    isPaused = !isPaused
}

function recalculate() {
    if (isPaused)
        return
    const worldState = store.getState().world
    const trex = update(worldState.trex, 1 / ms)
    store.dispatch(world.Trex.update(trex))
}

export function init() {
    const G = Vector(0, 10)
    const trex = RigidBody(100, Vector(0, 0), Vector(10, 0), [G])
    store.dispatch(world.Trex.init(trex))
    setInterval(recalculate, ms)
}
