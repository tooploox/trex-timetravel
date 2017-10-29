import { store } from "./index"
import * as world from './store/world'
import * as view from './view'
import { update as recalculate, Vector, RigidBody, Size, applyImpulse, Rect, sum } from './physicsEngine'

const randomNumber = (max: number) => Math.floor(Math.random() * 100000 % max)

let isPaused = false
export const pause = () => isPaused = !isPaused

function Entity(body: RigidBody, size: Size, shape: Rect[], imgPos: Vector, type: EntityType): Entity {
    return { ...body, size, shape, type, imgPos }
}

export namespace Trex {
    function updateState(reqState: TrexState, state: TrexState) {
        const { trex } = store.getState().world
        if (trex.state === reqState) {
            const newTrex = { ...trex, state }
            store.dispatch(world.Trex.jump(newTrex))
        }
    }

    export const duck = () => updateState(TrexState.Running, TrexState.Ducking)

    export const run = () => updateState(TrexState.Ducking, TrexState.Running)

    export function jump() {
        const state = store.getState().world
        const trex = state.trex
        if (state.t - trex.jumpStartT < state.dt * 20)
            store.dispatch(world.Trex.update(applyImpulse(trex, Vector(0, 800))))
        else if (trex.location.y === 0) {
            const newTrex = { ...applyImpulse(trex, Vector(0, 4000)), state: TrexState.Jumping }
            store.dispatch(world.Trex.jump(newTrex))
        }
    }

    export function update(state: World) {
        let newTrex = recalculate(state.trex, 1 / state.dt)

        if (state.t > newTrex.nextSpeedUpT) {
            const nextSpeedUpT = newTrex.nextSpeedUpT * 1.2
            const velocity = sum(newTrex.velocity, Vector(1, 0))
            newTrex = { ...newTrex, velocity, nextSpeedUpT }
        }

        if (newTrex.state === TrexState.Jumping && newTrex.location.y === 0) {
            const jumpDistance = newTrex.location.x - newTrex.jumpStartX
            newTrex = { ...newTrex, state: TrexState.Running, jumpDistance }
        }
        store.dispatch(world.Trex.update(newTrex))
    }

    export const init = () => {
        const G = Vector(0, -9810)
        const shape = [Rect(11, 15, 17, 26), Rect(2, 17, 9, 18), Rect(20, 1, 22, 15), Rect(14, 20, 20, 4)]
        const body = RigidBody(10, Vector(0, 0), Vector(250, 0), [G])
        const entity = Entity(body, Size(44, 47), shape, Vector(936, 2), EntityType.Trex)
        const trex: Trex = {
            ...entity,
            state: TrexState.Running,
            nextSpeedUpT: 1000,
            duckingImgPos: Vector(1112, 19),
            duckingShape: [Rect(0, 5, 62, 20)],
            duckingSize: Size(59, 32),
        }
        store.dispatch(world.Trex.update(trex))
    }
}

namespace Objects {
    const Cactus = (x: number) => {
        const shape = [Rect(0, 12, 9, 22), Rect(9, 0, 7, 46), Rect(19, 11, 5, 20)]
        const body = RigidBody(100, Vector(x, 0))
        return Entity(body, Size(25, 50), shape, Vector(332, 2), EntityType.CactusLarge)
    }

    const Pterodactyl = (x: number) => {
        const shape = [Rect(2, 8, 14, 14), Rect(16, 16, 16, 12), Rect(32, 19, 12, 10)]
        const body = RigidBody(10, Vector(x, randomNumber(100)), Vector(-80 - randomNumber(50), 0))
        return Entity(body, Size(46, 40), shape, Vector(134, 2), EntityType.Pterodactyl)
    }

    const obstacles = [Cactus, Pterodactyl]
    const getRandom = (x: number) => obstacles[randomNumber(obstacles.length)](x)

    function get(x: number, minDistance: number) {
        const objects: Entity[] = []
        for (let offset = 0; objects.length < 4; offset++) {
            if (Math.random() * 1000 % 200 >= 1)
                continue
            const object = getRandom(x + offset)
            offset += minDistance * 1.4 || object.size.width * 6
            objects.push(object)
        }
        return objects
    }

    export function update(state: World) {
        const lastX = state.objects.length === 0 ? 300 : state.objects[state.objects.length - 1].location.x
        const maxW = window.innerWidth
        const objects = state.objects
            .filter(o => o.location.x + maxW * .2 > state.trex.location.x)
            .map(o => o.type === EntityType.Pterodactyl ? recalculate(o, 1 / state.dt) : o)
        store.dispatch(world.updateObjects(objects))
        if (state.trex.location.x + maxW > lastX) {
            const minDistance = state.trex.velocity.x
            const minX = lastX + minDistance
            store.dispatch(world.addObjects(get(minX, minDistance)))
        }

    }
}

function tick() {
    const state = store.getState().world
    view.renderWorld(state)
    if (isPaused)
        return
    Objects.update(state)
    Trex.update(state)
}

export function init() {
    Trex.init()
    view.init()
    setInterval(tick, 1000 / store.getState().world.dt)
}
