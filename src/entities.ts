import { AvailableComponents, mass, position, radius, velocity } from './components';

export type Entity = {
	components: AvailableComponents[]
};

export const getEntities = (canvas: HTMLCanvasElement) => {
	const smallestDimension = Math.min(canvas.width, canvas.height);

	/**
	 * The Sun entity, drawn in the center of the canvas.
	 */
	const sun: Entity = {
		components: [
			position(canvas.width / 2, canvas.height / 2),
			radius(smallestDimension * 0.1),
			mass(40),
		]
	};

	/**
	 * The Planet entity, which should orbit around the sun.
	 */
	const planet: Entity = {
		components: [
			position(canvas.width / 2, (canvas.height / 2) - 150),
			radius(smallestDimension * 0.02),
			velocity(0.5, 0),
			mass(20),
		]
	};

	const entities = [sun, planet];

	/**
	 * A map of component names to a list of entities that have that component.
	 */
	const components = entities.reduce((map, entity) => {
		entity.components.forEach(component => {
			const existingEntities = map.get(component.name) ?? [];
			existingEntities.push(entity);

			map.set(component.name, existingEntities);
		});

		return map;
	}, new Map<AvailableComponents["name"], Entity[]>());

	return { entities, components };
};