/*const board: Board = {
    values: [BlockType.CactusLarge]
}*/
export const Vector = (x: number, y: number): Vector => ({ x, y })
const map = (v: Vector, f: (v: number) => number) => Vector(f(v.x), f(v.y))
export const multiply = (v: Vector, param: number) => map(v, v => v * param)
export const sum = (v1: Vector, v2: Vector) => Vector(v1.x + v2.x, v1.y + v2.y)

export function update(body: RigidBody, deltaTime: number): RigidBody {
    const acceleration = multiply(body.force, 1.0 / body.mass)
    const velocity = sum(body.velocity, multiply(acceleration, deltaTime))
    const location = sum(body.location, multiply(velocity, deltaTime))

    return {
        force: body.force,
        mass: body.mass,
        velocity,
        location,
    }
}
