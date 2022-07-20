import { AvailableComponentName, AvailableComponents } from './components';
import { Vec } from './vector';
import { EntityWithComponents } from './entities';
import { Engine } from './Engine';

export type GetEntities = <T extends AvailableComponentName[]>(...components: T) => Array<EntityWithComponents<Array<AvailableComponents[T[number]]>>>;
export type SystemParams = {
	engine: Engine,
	getEntities: GetEntities,
	timeDelta: number,
};
export type System = (params: SystemParams) => void;

export const physicsSystem: System = ({ getEntities, timeDelta }) => {
	let entities = getEntities('position', 'velocity', 'mass');

	entities.filter(entity => !entity.components.mass.data.stationary).forEach(entity => {
		const position = entity.components.position;
		const velocity = entity.components.velocity;

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