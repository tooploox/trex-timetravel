import { store } from "./index"
import { pause, jump } from "./game"

let ctx: CanvasRenderingContext2D

const keycodes = {
    JUMP: [38],  // Up, spacebar
    PAUSE: [32],  // Down
    RESTART: [13]  // Enter
}

function drawTrex(trex: RigidBody) {
    ctx.beginPath()
    const size = { width: 10, height: 50 }
    ctx.rect(trex.location.x, ctx.canvas.height - trex.location.y - size.height, size.width, size.height)
    ctx.fillStyle = "#FF0000"
    ctx.fill()
    ctx.closePath()
}

function drawBackground() {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.beginPath()
    ctx.rect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.fillStyle = "#eee"
    ctx.fill()
    ctx.closePath()
}

function render() {
    const world = store.getState().world
    drawBackground()
    drawTrex(world.trex)
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
