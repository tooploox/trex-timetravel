import { multiply, sum, Vector, update } from './game'

describe("Game", () => {
    describe("Vector", () => {
        it("creates Vecotr", () => {
            expect(Vector(0, 1)).toEqual({ x: 0, y: 1 })
        })

        it("multiply vecotr by const", () => {
            expect(multiply(Vector(1, 2), 1.5)).toEqual({ x: 1.5, y: 3 })
        })

        it("sums two vectors", () => {
            expect(sum(Vector(1, 2), Vector(3, 4))).toEqual({ x: 4, y: 6 })
        })
    })

    describe("Physics", () => {
        it("Remains object at rest when no force is applyied", () => {
            const rock: RigidBody = {
                mass: 100,
                location: Vector(0, 0),
                force: Vector(0, 0),
                velocity: Vector(0, 0)
            }
            const expected = { ...rock }
            expect(update(rock, 2)).toEqual(expected)
        })

        it("Moves object when no force is applyied and object was moving", () => {
            const ball: RigidBody = {
                mass: 10,
                location: Vector(0, 0),
                force: Vector(0, 0),
                velocity: Vector(1, 2)
            }

            const expected = {
                ...ball,
                location: Vector(2, 4)
            }
            expect(update(ball, 2)).toEqual(expected)
        })

        it("defines if a total force F acts on an object of mass m, " +
            "that object will necessarily accelerate with acceleration a = F / m.", () => {
                const ball: RigidBody = {
                    mass: 10,
                    location: Vector(0, 0),
                    force: Vector(10, 20),
                    velocity: Vector(0, 0)
                }
                const expected = {
                    ...ball,
                    velocity: Vector(1, 2),
                    location: Vector(1, 2)
                }
                expect(update(ball, 1)).toEqual(expected)
            })
    })
})
