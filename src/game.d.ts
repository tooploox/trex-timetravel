
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
interface Jump {
    time: number
    location: Vector
    velocity: Vector
}
interface RigidBody {
    location: Vector
    mass: number
    forces: Vector[]
    impulses: Vector[]
    velocity: Vector
    jump?: Jump
}
