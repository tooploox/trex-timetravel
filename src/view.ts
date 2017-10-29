import { store } from "./index"
import { pause, jump } from "./game"
import { Vector, Size } from "./physicsEngine"
namespace draw {
    function rect(ctx: CanvasRenderingContext2D, location: Vector, size: Size, color = "#2195f3") {
        ctx.beginPath()
        ctx.rect(location.x, ctx.canvas.height - location.y - size.height, size.width, size.height)
        ctx.fillStyle = color
        ctx.fill()
        ctx.closePath()
    }

    export const trex = (ctx: CanvasRenderingContext2D, trex: RigidBody) =>
        rect(ctx, trex.location, { width: 10, height: 30 })

    export const ground = (ctx: CanvasRenderingContext2D) =>
        rect(ctx, { x: 0, y: 0 }, { width: ctx.canvas.width, height: 1 })

    export const background = (ctx: CanvasRenderingContext2D) =>
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
}

interface View {
    frame: Rect
    render: (world: World) => void
}

class Camera {
    worldFrame: Rect
    frame: Rect
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
        draw.ground(this.ctx)
        //draw.trex(this.ctx, world.trex)

        const source = { ...Vector(848, 2), ...Size(44, 47) }
        this.ctx.save()
        this.ctx.drawImage(this.image,
            source.x, source.y, source.width, source.height,
            world.trex.location.x - source.width / 2, this.ctx.canvas.height - world.trex.location.y - source.height,
            source.width, source.height)
        this.ctx.restore()
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

const renderWorld = () => {
    const world = store.getState().world
    views.forEach(v => v.render(world))
}

export function init() {
    views = [new CanvasView(), new CanvasView(), new CanvasView()]
    initKeyboard()
    setInterval(renderWorld, 1000 / 60)
}
