export const mirrorH = (h: number, rect: Rect) =>
    ({ ...rect, y: h - rect.y - rect.height - 1 })
