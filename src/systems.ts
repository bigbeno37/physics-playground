import { AvailableComponentName, AvailableComponents } from './components';
import { Vec } from './vector';
import { EntityWithComponents } from './entities';
import { Engine } from './Engine';

/**
 * A query function that allows for filtering entities based on their components.
 * @example
 * declare var getEntities: GetEntities;
 * const entities = getEntities('position', 'mass'); // Returns all entities with both position and mass components.
 * entities.forEach(entity => console.log(entity.components.position.data.x)); // Prints the x position of each entity, without needing to cast to a Position component.
 */
export type GetEntities = <T extends AvailableComponentName[]>(...components: T) => Array<EntityWithComponents<Array<AvailableComponents[T[number]]>>>;

/**
 * Parameters that will be provided to a System.
 */
export type SystemParams = {
	/**
	 * A reference to the current engine.
	 */
	engine: Engine,

	/**
	 * A function that returns a query function that can be used to filter entities based on their components.
	 */
	getEntities: GetEntities,

	/**
	 * The time since the last frame in milliseconds.
	 */
	timeDelta: number,
};

/**
 * A function that will be called each frame that can be used to update the state of the engine and entities / components.
 */
export type System = (params: SystemParams) => void;

/**
 * The physics system that will be used to update the position of entities with position, velocity and mass
 * components.
 */
export const physicsSystem: System = ({ getEntities, timeDelta }) => {
	const entities = getEntities('position', 'velocity', 'mass');

	entities
		// Filter out entities that are stationary and shouldn't move, but apply gravity to all other entities.
		.filter(entity => !entity.components.mass.data.stationary)
		.forEach(entity => {
			const position = entity.components.position;
			const velocity = entity.components.velocity;

			// Apply gravity forces to the current entity, based on masses from all other entities.
			entities.filter(other => other !== entity).forEach(otherEntity => {
				const otherMass = otherEntity.components.mass.data.mass;
				const otherPosition = otherEntity.components.position;

				// Calculate the distance between the two entities to determine the acceleration vector.
				const distanceVector = Vec.sub(otherPosition.data, position.data);
				const distance = Vec.magnitude(distanceVector);

				// Calculate the force on the given entity based on the other entity's mass and distance using
				// Newton's law of universal gravitation, F = G * m1 * m2 / d^2. (G is set as 1 for simplicity)
				const gravitationalForce = otherMass / Math.pow(distance, 2);
				const acceleration = Vec.scale(Vec.unit(distanceVector), gravitationalForce);

				velocity.data = Vec.add(velocity.data, Vec.scale(acceleration, timeDelta));
			});

			position.data = Vec.add(position.data, Vec.scale(velocity.data, timeDelta));
		});
};

/**
 * Creates a render system based on the given canvas rendering context.
 *
 * @param ctx The canvas rendering context.
 */
export const createRenderSystem = (ctx: CanvasRenderingContext2D): System => ({ getEntities }) => {
	const entities = getEntities('position', 'radius');

	ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
	entities.forEach(entity => {
		const position = entity.components.position;
		const radius = entity.components.radius;

		ctx.beginPath();
		ctx.arc(position.data.x, position.data.y, radius.data, 0, 2 * Math.PI);
		ctx.fillStyle = '#000';
		ctx.fill();
	});
};