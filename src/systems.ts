import { isMass, isPosition, isVelocity } from './components';
import { Vec } from './vector';
import { Entity } from './entities';

/**
 * Simulates physics on the given entity to update its position. This will run through all other available entities
 * with mass, and calculate the acceleration of the given entity based on their mass and distance from the given entity.
 *
 * @param entity The entity whose position and velocity will be updated.
 * @param availableEntities All available entities.
 * @param delta The amount of time since the last tick.
 */
export const updateEntityPositionWithVelocity = (entity: Entity, availableEntities: Entity[], delta: DOMHighResTimeStamp) => {
	const position = entity.components.find(isPosition);
	const velocity = entity.components.find(isVelocity)!;
	const mass = entity.components.find(isMass);

	if (!position) throw new Error('Position component required when using Velocity!');

	// If the entity has no mass, it will not be affected by other entities.
	if (mass) {
		availableEntities.filter(otherEntity => otherEntity !== entity).forEach(otherEntity => {
			const otherMass = otherEntity.components.find(isMass);

			// If the other entity has no mass, it will not be affected by the given entity.
			if (!otherMass) return;

			const otherPosition = otherEntity.components.find(isPosition)!;

			// Calculate the distance between the two entities to determine the acceleration vector.
			const distanceVector = Vec.sub(otherPosition.data, position.data);
			const distance = Vec.magnitude(distanceVector);

			// Calculate the force on the given entity based on the other entity's mass and distance using
			// Newton's law of universal gravitation, F = G * m1 * m2 / d^2. (G is set as 1 for simplicity)
			const gravitationalForce = otherMass.data / Math.pow(distance, 2);
			const acceleration = Vec.scale(Vec.unit(distanceVector), gravitationalForce);

			velocity.data = Vec.add(velocity.data, Vec.scale(acceleration, delta));
		});
	}

	position.data = Vec.add(position.data, Vec.scale(velocity.data, delta));
};