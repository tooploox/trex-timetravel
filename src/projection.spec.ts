import * as projection from './projection'

describe("Projection", () => {
    it("mirror rect horizontally", () => {
        const rect = { x: 0, y: 0, width: 10, height: 5 }
        const expected = { x: 0, y: 100 - 5, width: 10, height: 5 }
        expect(projection.mirrorH(100, rect)).toEqual(expected)
    })
})
