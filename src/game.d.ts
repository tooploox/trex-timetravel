///<reference path="./physicsEngine.d.ts" />

declare const enum EntityType {
    Trex = 0,
    CactusSmall = 1,
    CactusLarge = 2
}

interface World {
    dt: number
    t: number
    objects?: Entity[]
    movingObjects?: Entity[]
    trex?: Trex
    // Defines max right point that blocks should be rendered for
    maxView: Rect
}

interface Entity extends RigidBody {
    size: Size
    type?: EntityType
}

interface Trex extends Entity {
    jumpT?: number
}
