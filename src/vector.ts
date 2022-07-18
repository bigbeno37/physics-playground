export type Vector = { x: number, y: number };

export const Vec = {
	add: (a: Vector, b: Vector): Vector => ({x: a.x + b.x, y: a.y + b.y}),
	sub: (a: Vector, b: Vector): Vector => ({x: a.x - b.x, y: a.y - b.y}),
	magnitude: (vector: Vector): number => Math.sqrt(vector.x * vector.x + vector.y * vector.y),
	scale: (vector: Vector, scalar: number): Vector => ({x: vector.x * scalar, y: vector.y * scalar}),
	unit: (vector: Vector): Vector => Vec.scale(vector, 1 / Vec.magnitude(vector)),
};