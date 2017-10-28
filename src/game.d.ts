
declare const enum BlockType {
    Normal = 0,
    CactusLarge = 1
}

interface World {
    board?: BlockType[]
    objects?: RigidBody[]
    trex?: RigidBody,
    width: number
    height: number
}

interface Vector {
    x: number
    y: number
}

interface RigidBody {
    location: Vector
    mass: number
    forces?: Vector[]
    impulses?: Vector[]
    velocity: Vector
}
