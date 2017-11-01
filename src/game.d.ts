///<reference path="./physicsEngine.d.ts" />

declare const enum EntityType {
    Trex = 0,
    Pterodactyl = 1,
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
    trex: Trex
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

    duckingImgPos: Vector
    duckingShape: Rect[]
    duckingSize: Size

    nextSpeedUpT: number
}

interface View {
    frame: Rect
    render: (world: World) => void
}
