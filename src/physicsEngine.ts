export const Vector = (x: number, y: number): Vector => ({ x, y })

export const Size = (width: number, height: number): Size => ({ width, height })

export function RigidBody(mass: number, location = Vector(0, 0),
    velocity = Vector(0, 0), forces: Vector[] = [], impulses: Vector[] = []): RigidBody {
    return { mass, location, velocity, forces, impulses }
}

const vmap = (v: Vector, f: (v: number) => number) =>
    Vector(f(v.x), f(v.y))

const vmapReduce = (vs: Vector[], f: (v: number) => number) =>
    vmap(vs.reduce((l, r) => sum(l, r), Vector(0, 0)), f)

export function sum(v1: Vector, v2: Vector, v3?: Vector): Vector {
    const result = Vector(v1.x + v2.x, v1.y + v2.y)
    return v3 ? sum(result, v3) : result
}

export function applyForce<T extends RigidBody>(body: RigidBody, force: Vector): T {
    return { ...(body as any), forces: [...(body.forces || []), force] }
}

export function applyImpulse<T extends RigidBody>(body: T, impulse: Vector): T {
    return { ...(body as any), impulses: [...(body.impulses || []), impulse] }
}

export function update<T extends RigidBody>(body: T, deltaTime: number): T {
    const acceleration = vmapReduce(body.forces || [], v => v / body.mass * deltaTime)
    const impulses = vmapReduce(body.impulses || [], v => v / body.mass)
    const velocity = sum(body.velocity, impulses, acceleration)
    const location = sum(body.location, vmap(velocity, v => v * deltaTime))

    if (location.y < 0) {
        location.y = 0
        velocity.y = 0
    }

    return { ...(body as any), impulses: [], location, velocity }
}
