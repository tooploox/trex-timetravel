///<reference path="./physicsEngine.d.ts" />

declare const enum EntityType {
    Trex = 0,
    Pterodactil = 1,
    CactusSmall = 2,
    CactusLarge = 3
}

declare const enum TrexState {
    Running = 0,
    Jumping = 1,
    Ducking = 2
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
    shape: Rect[]
    imgPos?: Vector
}

interface Trex extends Entity {
    state: TrexState

    jumpStartT?: number
    jumpStartX?: number
    jumpDistance?: number,

    nextSpeedUpT: number
}
