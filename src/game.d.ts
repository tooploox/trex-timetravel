///<reference path="./physicsEngine.d.ts" />

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
