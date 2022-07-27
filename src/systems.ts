import { Vec } from './vector';
import { Query, System } from './engine/types';
import { Mass, Position, Radius, Velocity } from './components';

/**
 * The physics system that will be used to update the position of entities with position, velocity and mass
 * components.
 */
export const physicsSystem: System = (query: Query<[Position, Velocity, Mass]>, { timeDelta }) => {
	const entities = query.required('position', 'velocity', 'mass');

	entities
		// Filter out entities that are stationary and shouldn't move, but apply gravity to all other entities.
		.filter(entity => !entity.components.mass.stationary)
		.forEach(entity => {
			const position = entity.components.position;
			const velocity = entity.components.velocity;

			// Apply gravity forces to the current entity, based on masses from all other entities.
			entities.filter(other => other !== entity).forEach(otherEntity => {
				const otherMass = otherEntity.components.mass.value;
				const otherPosition = otherEntity.components.position;

				// Calculate the distance between the two entities to determine the acceleration vector.
				const distanceVector = Vec.sub(otherPosition, position);
				const distance = Vec.magnitude(distanceVector);

				// Calculate the force on the given entity based on the other entity's mass and distance using
				// Newton's law of universal gravitation, F = G * m1 * m2 / d^2. (G is set as 1 for simplicity)
				const gravitationalForce = otherMass / Math.pow(distance, 2);
				const acceleration = Vec.scale(Vec.unit(distanceVector), gravitationalForce);

				const { x: newX, y: newY } = Vec.add(velocity, Vec.scale(acceleration, timeDelta));
				velocity.x = newX;
				velocity.y = newY;
			});

			const { x: newX, y: newY } = Vec.add(position, Vec.scale(velocity, timeDelta));
			position.x = newX;
			position.y = newY;
		});
};

/**
 * Creates a render system based on the given canvas rendering context.
 *
 * @param ctx The canvas rendering context.
 */
export const createRenderSystem = (ctx: CanvasRenderingContext2D): System => (query: Query<[Position, Radius]>) => {
	const entities = query.required('position', 'radius');

	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	entities.forEach(entity => {
		const position = entity.components.position;
		const radius = entity.components.radius;

		ctx.beginPath();
		ctx.arc(position.x, position.y, radius.value, 0, 2 * Math.PI);
		ctx.fillStyle = '#000';
		ctx.fill();
	});
};