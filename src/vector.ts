export type Vector = { x: number, y: number };

/**
 * A vector class that supports addition, subtraction, scaling, and normalisation, among other utilities.
 */
export const Vec = {
	/**
	 * Adds two vectors together.
	 *
	 * @param a The first vector.
	 * @param b The second vector.
	 */
	add: (a: Vector, b: Vector): Vector => ({x: a.x + b.x, y: a.y + b.y}),

	/**
	 * Subtracts two vectors.
	 *
	 * @param a The first vector.
	 * @param b The second vector.
	 */
	sub: (a: Vector, b: Vector): Vector => ({x: a.x - b.x, y: a.y - b.y}),

	/**
	 * Returns the length of a vector.
	 *
	 * @param vector The vector.
	 */
	magnitude: (vector: Vector): number => Math.sqrt(vector.x * vector.x + vector.y * vector.y),

	/**
	 * Scales a vector by the given scalar.
	 *
	 * @param vector The vector.
	 * @param scalar The scalar to scale the vector by.
	 */
	scale: (vector: Vector, scalar: number): Vector => ({x: vector.x * scalar, y: vector.y * scalar}),

	/**
	 * Normalises a vector.
	 *
	 * @param vector The vector.
	 */
	unit: (vector: Vector): Vector => Vec.scale(vector, 1 / Vec.magnitude(vector)),
};