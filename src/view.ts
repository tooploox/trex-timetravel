import { store } from "./index"
import { pause, jump } from "./game"

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
    render: (world: World) => void
}

class CanvasView implements View {
    private ctx: CanvasRenderingContext2D

    constructor() {
        const app = document.getElementById('app')
        const canvas = document.createElement("canvas") as HTMLCanvasElement
        app.appendChild(canvas)
        canvas.width = window.innerWidth
        this.ctx = canvas.getContext('2d')
    }

    render(world: World) {
        draw.background(this.ctx)
        draw.ground(this.ctx)
        draw.trex(this.ctx, world.trex)
    }
}

const keycodes = {
    JUMP: [38],  // Up, spacebar
    PAUSE: [32],  // Down
    RESTART: [13]  // Enter
}

export function init() {
    const views: View[] = [new CanvasView(), new CanvasView(), new CanvasView()]
    document.addEventListener('keydown', e => {
        if (keycodes.PAUSE.indexOf(e.keyCode) !== -1)
            pause()
        else if (keycodes.JUMP.indexOf(e.keyCode) !== -1)
            jump()
    })
    setInterval(() => {
        const world = store.getState().world
        views.forEach(v => v.render(world))
    }, 1000 / 60)
}
