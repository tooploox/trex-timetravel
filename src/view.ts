import { pause, jump } from "./game"
import { Vector, Size, sum } from "./physicsEngine"
import { mirrorH } from './camera'

export namespace draw {
    type Context = CanvasRenderingContext2D
    type Image = HTMLImageElement
    function rect(ctx: Context, location: Vector, size: Size, color = "#535353") {
        ctx.beginPath()
        ctx.rect(location.x, ctx.canvas.height - location.y - size.height, size.width, size.height)
        ctx.fillStyle = color
        ctx.fill()
        ctx.closePath()
    }

    export const ground = (ctx: Context) =>
        rect(ctx, { x: 0, y: 1 }, { width: ctx.canvas.width, height: 1 })

    export const background = (ctx: Context) =>
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    export const image = (ctx: Context, image: Image, location: Vector, source: Rect) => {
        const box = mirrorH(ctx.canvas.height, { ...source, ...location })
        ctx.drawImage(image,
            source.x, source.y, source.width, source.height,
            box.x, box.y, box.width, box.height
        )
    }

    export function collisionBox(ctx: Context, tRexBox: Rect) {
        ctx.save()
        ctx.strokeStyle = '#f00'
        const box = mirrorH(ctx.canvas.height, tRexBox)
        ctx.strokeRect(box.x, box.y, box.width, box.height)
        ctx.restore()
    }

    export function collisionShape(ctx: Context, obj: Entity) {
        ctx.save()
        ctx.strokeStyle = '#f00'
        const { shape, location, size } = obj
        const y = mirrorH(ctx.canvas.height, { ...size, ...location }).y
        shape.forEach(shape => {
            ctx.strokeStyle = '#f00'

            let box = { ...shape, x: shape.x + location.x, y: shape.y + y }
            // mirrorH(ctx.canvas.height, { ...shape, ...sum(location, shape) })
            ctx.strokeRect(box.x, box.y, box.width, box.height)
        })
        ctx.restore()
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
        this.image = new Image(60, 45)   // using optional size for image
        this.image.src =
            'https://github.com/wayou/t-rex-runner/raw/gh-pages/assets/default_100_percent/100-offline-sprite.png'

        const app = document.getElementById('app')
        const canvas = document.createElement("canvas") as HTMLCanvasElement
        app.appendChild(canvas)
        canvas.width = window.innerWidth
        this.ctx = canvas.getContext('2d')
        this.frame = { x: 0, y: 0, width: 30, height: 10 }
    }

    render(world: World) {
        draw.background(this.ctx)
        const { trex, t, dt } = world
        const w = 44
        const dtPerFrame = 12
        const offset = trex.location.y > 0 ? 0 :
            Math.floor((Math.floor(t / dt) % (2 * dtPerFrame)) / dtPerFrame)
        const source = { ...Vector(936 + offset * w, 2), ...trex.size }
        draw.image(this.ctx, this.image, trex.location, source)
        draw.ground(this.ctx)

        draw.collisionShape(this.ctx, world.trex)
    }
}

function initKeyboard() {
    const keycodes = {
        JUMP: [38],  // Up
        PAUSE: [32],  // spacebar
        RESTART: [13]  // Enter
    }

    document.addEventListener('keydown', e => {
        if (keycodes.PAUSE.indexOf(e.keyCode) !== -1)
            pause()
        else if (keycodes.JUMP.indexOf(e.keyCode) !== -1)
            jump()
    })
}

let views: View[]

export const renderWorld = (world: World) =>
    views.forEach(v => v.render(world))

export function init() {
    views = [new CanvasView(), new CanvasView(), new CanvasView(), new CanvasView(), new CanvasView()]
    initKeyboard()
}
