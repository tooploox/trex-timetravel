import { pause, jump } from "./game"
import { Vector, sum } from "./physicsEngine"
import { mirrorH } from './projection'
import * as world from '@/store/world'

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

    export function shape(ctx: Context, obj: Trex, strokeStyle = '#f00') {
        ctx.save()
        ctx.strokeStyle = strokeStyle
        const { shape, location, size } = obj
        const y = mirrorH(ctx.canvas.height, { ...size, ...location }).y
        shape.map(shape => ({ ...shape, x: shape.x + location.x, y: shape.y + y }))
            .forEach(box => ctx.strokeRect(box.x, box.y, box.width, box.height))
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

    renderObjects(world: World) {
        world.objects.forEach(obj => {
            const source = { ...Vector(332, 2), ...obj.size }
            const location = sum(obj.location, this.frame)
            draw.image(this.ctx, this.image, location, source)
            //  draw.shape(this.ctx, { ...obj, location }, '#0f0')
        })
    }

    private getTrexFrame(world: World) {
        const { trex, t, dt } = world
        const dtPerFrame = 14
        const frameOffset = trex.location.y > 0 ? -2 : Math.floor(t / dt % (2 * dtPerFrame) / dtPerFrame)
        return { ...Vector(936 + frameOffset * trex.size.width, 2), ...trex.size }
    }

    renderTrex(world: World) {
        const location = sum(world.trex.location, this.frame)
        draw.image(this.ctx, this.image, location, this.getTrexFrame(world))
        //draw.shape(this.ctx, { ...world.trex as Entity, location })
    }

    render(world: World) {
        this.frame = { ...this.frame, x: -world.trex.location.x + 100 }

        draw.background(this.ctx)
        this.renderObjects(world)
        this.renderTrex(world)
        draw.ground(this.ctx)
    }
}

function initKeyboard() {
    const keycodes = {
        JUMP: [38],  // Up
        PAUSE: [32],  // spacebar
        RESTART: [13]  // Enter
    }

    document.addEventListener('keydown', ({ keyCode }) => {
        if (keycodes.PAUSE.indexOf(keyCode) !== -1)
            pause()
        else if (keycodes.JUMP.indexOf(keyCode) !== -1)
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
