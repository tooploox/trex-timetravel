
interface Size {
    width: number,
    height: number
}
interface Vector {
    x: number
    y: number
}

interface RigidBody {
    location: Vector
    mass: number
    forces?: Vector[]
    impulses?: Vector[]
    velocity: Vector
}
