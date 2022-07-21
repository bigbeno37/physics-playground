import {
	AvailableComponent,
	AvailableComponentName,
	AvailableComponents,
} from './components';

export type EntityId = number;

/**
 * Represents an Entity, with an ID and zero or more components. Components are stored in a map for efficient lookup.
 */
export type Entity = {
	id: EntityId,
	components: {
		[key in AvailableComponentName]?: AvailableComponents[key]
	}
};

/**
 * A utility type extending the Entity type, to allow specifying multiple components as definitely existing on this
 * entity for an easier API.
 *
 * @example
 * declare var entity: Entity;
 * entity.components.position; // Type is Position | undefined, as it might / might not exist.
 *
 * declare var entity: EntityWithComponents<[Position]>;
 * entity.components.position; // Type is Position, no longer possibly undefined.
 */
export type EntityWithComponents<T extends Array<AvailableComponent>> = Entity & {
	components: {
		[key in T[number]['name']]: AvailableComponents[key]
	}
};