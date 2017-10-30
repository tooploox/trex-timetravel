import { pause, Trex, rewind } from './game'
import { Vector, Size, sum } from "./physicsEngine"
import { mirrorH } from './projection'

export namespace draw {
    export const background = (ctx: Context) => ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    export const image = (ctx: Context, image: Image, location: Vector, source: Rect) => {
        const box = mirrorH(ctx.canvas.height, { ...source, ...location })
        ctx.drawImage(image,
            source.x, source.y, source.width, source.height,
            box.x, box.y, box.width, box.height
        )
    }

    export function shape(ctx: Context, obj: Entity, strokeStyle = '#f00') {
        ctx.strokeStyle = strokeStyle
        const { shape, location, size } = obj
        const y = mirrorH(ctx.canvas.height, { ...size, ...location }).y
        shape.map(shape => ({ ...shape, x: shape.x + location.x, y: shape.y + y }))
            .forEach(box => ctx.strokeRect(box.x, box.y, box.width, box.height))
    }
}

interface View {
    frame: Rect
    render: (world: World) => void
}

class CanvasView implements View {
    private ctx: CanvasRenderingContext2D
    frame: Rect
    image: HTMLImageElement

    constructor() {
        this.image = new Image()
        this.image.src =
            'https://github.com/wayou/t-rex-runner/raw/gh-pages/assets/default_100_percent/100-offline-sprite.png'

        const app = document.getElementById('app')
        const canvas = document.createElement("canvas") as HTMLCanvasElement
        app.appendChild(canvas)
        canvas.width = window.innerWidth
        this.ctx = canvas.getContext('2d')
        this.frame = { x: 0, y: 0, width: canvas.width, height: canvas.height }
    }
    private getPterodactylFrame(world: World, obj: Entity) {
        const { t, dt } = world
        const { size, imgPos } = obj
        const dtPerFrame = Math.floor(obj.velocity.x / -8)
        const frameOffset = Math.floor(t / dt % (2 * dtPerFrame) / dtPerFrame)
        return { ...Vector(imgPos.x + frameOffset * size.width, imgPos.y), ...size }
    }

    renderObjects(world: World) {
        world.objects.forEach(obj => {
            const source = obj.type === EntityType.Pterodactyl ?
                this.getPterodactylFrame(world, obj) : { ...obj.imgPos, ...obj.size }
            const location = sum(obj.location, this.frame)
            draw.image(this.ctx, this.image, location, source)
            //draw.shape(this.ctx, { ...obj, location }, '#0f0')
        })
    }

    private getTrexFrame(world: World) {
        const { trex, t, dt } = world
        const dtPerFrame = 14
        const frameOffset = trex.state === TrexState.Jumping ? -2 : Math.floor(t / dt % (2 * dtPerFrame) / dtPerFrame)
        const isDucking = trex.state === TrexState.Ducking
        const size = isDucking ? trex.duckingSize : trex.size
        const imgPos = isDucking ? trex.duckingImgPos : trex.imgPos
        return { ...Vector(imgPos.x + frameOffset * size.width, imgPos.y), ...size }
    }

    renderTrex(world: World) {
        const location = sum(world.trex.location, this.frame)
        draw.image(this.ctx, this.image, location, this.getTrexFrame(world))
        //draw.shape(this.ctx, { ...world.trex as Entity, location })
    }

    renderBg(world: World) {
        const size = Size(1190, 16)
        const x = world.trex.location.x
        const i = Math.floor(x / size.width)
        const source = { ...Vector(12, 51), ...Size(1200, 16) }
        draw.image(this.ctx, this.image, Vector(i * size.width - x, 0), source)
        draw.image(this.ctx, this.image, Vector((i + 1) * size.width - x, 0), source)
    }

    render(world: World) {
        this.frame = { ...this.frame, x: -world.trex.location.x + 100 }

        draw.background(this.ctx)
        this.renderObjects(world)
        this.renderTrex(world)
        this.renderBg(world)
    }
}

function initKeyboard() {
    const DuckKey = 40
    const keycodesMap = { 38: Trex.jump, 32: pause, [DuckKey]: Trex.duck, 82: rewind }

    document.addEventListener('keydown', ({ keyCode }) => {
        if ((keycodesMap as any)[keyCode])
            (keycodesMap as any)[keyCode]()
    })

    document.addEventListener('keyup', ({ keyCode }) =>
        (keyCode === DuckKey) && Trex.run())
}

let views: View[]

export const renderWorld = (world: World) =>
    views.forEach(v => v.render(world))

export function init() {
    //views = Array.from(Array(6)).map(i => new CanvasView)
    views = [new CanvasView()]
    initKeyboard()
}
