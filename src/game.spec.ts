import { sum, Vector, update } from './game'

describe("Game", () => {
    describe("Vector", () => {
        it("creates Vecotr", () => {
            expect(Vector(0, 1)).toEqual({ x: 0, y: 1 })
        })

        it("sums two vectors", () => {
            expect(sum(Vector(1, 2), Vector(3, 4))).toEqual({ x: 4, y: 6 })
        })

        it("sums three vectors", () => {
            expect(sum(Vector(1, 2), Vector(3, 4), Vector(.5, 1.5))).toEqual({ x: 4.5, y: 7.5 })
        })
    })

    describe("Physics", () => {
        // An object at rest stays at rest and an object in motion stays in motion.
        it("Remains object at rest when no force is applyied", () => {
            const rock: RigidBody = {
                mass: 100,
                location: Vector(0, 0),
                forces: [],
                impulses: [],
                velocity: Vector(0, 0)
            }
            const expected = { ...rock }
            expect(update(rock, 2)).toEqual(expected)
        })
        // An object at rest stays at rest and an object in motion stays in motion
        // at a constant speed and direction unless acted upon by an unbalanced force.
        it("Moves object when no force is applyied and object was moving", () => {
            const ball: RigidBody = {
                mass: 10,
                location: Vector(0, 0),
                forces: [],
                impulses: [],
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
                    forces: [Vector(10, 20)],
                    impulses: [],
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
