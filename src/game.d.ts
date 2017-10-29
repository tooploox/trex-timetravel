///<reference path="./physicsEngine.d.ts" />

declare const enum EntityType {
    Trex = 0,
    CactusSmall = 1,
    CactusLarge = 2
}

interface World {
    dt: number
    t: number
    objects?: Trex[]
    movingObjects?: Trex[]
    trex?: Trex
    // Defines max right point that blocks should be rendered for
    maxView: Rect
}

interface Trex extends RigidBody {
    size: Size
    type?: EntityType
    shape: Rect[]
}

interface Trex extends Trex {
    jumpT?: number
}
