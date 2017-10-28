import { Vector, RigidBody, sum, update, applyForce, applyImpulse } from './game'

describe("Game", () => {
    describe("Vector", () => {
        it("creates a vector", () => expect(Vector(0, 1)).toEqual({ x: 0, y: 1 }))

        it("sums two vectors", () => expect(sum(Vector(1, 2), Vector(3, 4))).toEqual({ x: 4, y: 6 }))

        it("sums three vectors", () => {
            expect(sum(Vector(1, 2), Vector(3, 4), Vector(.5, 1.5))).toEqual({ x: 4.5, y: 7.5 })
        })
    })

    describe("Physics", () => {
        it("Applies forces", () => {
            const ball = RigidBody(10)
            const f1 = Vector(1, 1)
            const f2 = Vector(2, 3)
            const expected = { ...ball, forces: [f1, f2] }
            const actual = applyForce(applyForce(ball, f1), f2)
            expect(actual).toEqual(expected)
        })

        it("Applies impulses", () => {
            const ball = RigidBody(10)
            const i1 = Vector(1, 1)
            const i2 = Vector(1, 1)
            const expected = { ...ball, impulses: [i1, i2] }
            const actual = applyImpulse(applyImpulse(ball, i1), i2)
            expect(actual).toEqual(expected)
        })

        // An object at rest stays at rest and an object in motion stays in motion.
        it("Remains object at rest when no force is applyied", () => {
            const rock = RigidBody(100)
            const expected = { ...rock }
            expect(update(rock, 2)).toEqual(expected)
        })

        // An object at rest stays at rest and an object in motion stays in motion
        // at a constant speed and direction unless acted upon by an unbalanced force.
        it("Moves object when no force is applyied and object was moving", () => {
            const velocity = Vector(1, 2)
            const ball = RigidBody(10, Vector(0, 0), velocity)
            const expected = { ...ball, location: Vector(2, 4) }
            expect(update(ball, 2)).toEqual(expected)
        })

        it("defines if a total force F acts on an object of mass m, " +
            "that object will necessarily accelerate with acceleration a = F / m.", () => {
                const ball = applyForce(RigidBody(10), Vector(10, 20))
                const expected = { ...ball, velocity: Vector(1, 2), location: Vector(1, 2) }
                expect(update(ball, 1)).toEqual(expected)
            })

        describe("Jump of rigid body", () => {
            const gravityForce = Vector(0, -10)
            const jumpForce = Vector(0, 20)
            const ball = applyImpulse(applyForce(RigidBody(10), gravityForce), jumpForce)
            const velocity1s = Vector(0, jumpForce.y / ball.mass + gravityForce.y / ball.mass)
            const location1s = Vector(0, ball.location.y + velocity1s.y)

            it("recalculates jumping body after 1s (with 1s step)", () => {
                const expected: RigidBody = { ...ball, velocity: velocity1s, location: location1s }
                delete expected.impulses
                expect(update(ball, 1)).toEqual(expected)
            })

            it("recalculates jumping body after 2s (with 1s step)", () => {
                const velocity2s = Vector(0, velocity1s.y + gravityForce.y / ball.mass)
                const location2s = Vector(0, location1s.y + velocity2s.y)
                const expected: RigidBody = { ...ball, velocity: velocity2s, location: location2s }
                delete expected.impulses
                expect(update(update(ball, 1), 1)).toEqual(expected)
            })

            it("stays on a ground level when only Gravity is applied", () => {
                const gravityForce = Vector(0, -10)
                const ball = applyForce(RigidBody(10), gravityForce)
                const expected: RigidBody = { ...ball, velocity: Vector(0, 0), location: Vector(0, 0) }
                expect(update(ball, 1)).toEqual(expected)
            })
        })
    })
})
