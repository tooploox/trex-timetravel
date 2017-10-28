import { store } from "./index"
import { pause, jump } from "./game"

let ctx: CanvasRenderingContext2D

const keycodes = {
    JUMP: [38],  // Up, spacebar
    PAUSE: [32],  // Down
    RESTART: [13]  // Enter
}

namespace draw {
    function rect(location: Vector, size: Size, color = "#2195f3") {
        ctx.beginPath()
        ctx.rect(location.x, ctx.canvas.height - location.y - size.height, size.width, size.height)
        ctx.fillStyle = color
        ctx.fill()
        ctx.closePath()
    }

    export const trex = (trex: RigidBody) =>
        rect(trex.location, { width: 10, height: 30 })

    export const ground = () =>
        rect({ x: 0, y: 0 }, { width: ctx.canvas.width, height: 1 })

    export const background = () => ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
}

function render() {
    const world = store.getState().world
    draw.background()
    draw.ground()
    draw.trex(world.trex)
}

export function init() {
    const app = document.getElementById('app')
    const canvas = document.createElement("canvas") as HTMLCanvasElement
    document.addEventListener('keydown', e => {
        if (keycodes.PAUSE.indexOf(e.keyCode) !== -1)
            pause()
        if (keycodes.JUMP.indexOf(e.keyCode) !== -1)
            jump()
    })
    app.appendChild(canvas)
    canvas.width = window.innerWidth
    ctx = canvas.getContext('2d')
    setInterval(render, 1000 / 60)
}
