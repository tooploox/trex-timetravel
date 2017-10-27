
declare const enum BlockType {
    Normal = 0,
    CactusLarge = 1
}

interface Board {
    values: BlockType[]
}
interface Vector {
    x: number
    y: number
}

interface RigidBody {
    location: Vector
    mass: number
    force: Vector
    velocity: Vector
}
