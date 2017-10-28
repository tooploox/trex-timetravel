import { store } from "./index"
import { Size, pause } from "./game"

let ctx: CanvasRenderingContext2D

function drawTrex(trex: RigidBody) {
    ctx.beginPath()
    const size = Size(10, 50)
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
    document.addEventListener('keydown', e => pause())
    app.appendChild(canvas)
    ctx = canvas.getContext('2d')

    setInterval(render, 1000 / 60)
}
