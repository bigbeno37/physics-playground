import { mapAddToSet, mapDeleteFromSet } from '../utils';
import { AnyComponent, AnyComponentList, Entity, EntityId, EntityWithComponents, Query, System } from './types';

/**
 * Commands available to a reference to an entity. This is intended to be used from systems as a way of adding and removing
 * components from an entity, as well as despawning entities.
 */
type EntityCommands = {
	/**
	 * The current entity.
	 */
	entity: Entity,

	/**
	 * Inserts the given components into this Entity, replacing the existing component if it already exists on this entity.
	 *
	 * @param component The component to insert.
	 */
	insert: (component: AnyComponent) => EntityCommands,

	/**
	 * Removes the given component from this Entity if it exists.
	 *
	 * @param component The component to remove.
	 */
	remove: (componentName: string) => EntityCommands,

	/**
	 * Despawns this Entity. Interacting with this reference after despawning will result in undefined behavior.
	 */
	despawn: () => void,
};

/**
 * The core engine that will be used to manage entities and systems.
 */
export class Engine {
	/**
	 * The next ID to be assigned to an entity. This is incremented each time an entity is created.
	 * @private
	 */
	private _nextId = 0;

	/**
	 * The map of entities that are currently active in the engine.
	 * @private
	 */
	private _entities = new Map<EntityId, Entity>();

	/**
	 * The map of components that are currently active in the engine.
	 * @private
	 */
	private _components = new Map<string, Set<EntityId>>();

	/**
	 * All systems registered with this engine.
	 * @private
	 */
	private _systems: System[] = [];

	/**
	 * The previous time the engine rendered a frame. Used for calculating delta time.
	 * @private
	 */
	private _previousTime: number | undefined;

	/**
	 * Retrieves an entity by ID. This is intended for use with systems.
	 *
	 * @param entityId The ID of the entity to retrieve.
	 */
	entity = (entityId: EntityId): EntityCommands | undefined => {
		const entity = this._entities.get(entityId);
		if (!entity) {
			return;
		}

		const commands: EntityCommands = {
			entity,
			insert: component => {
				entity.components[component.name] = component;
				mapAddToSet(component.name, entityId, this._components);

				return commands;
			},
			remove: componentName => {
				delete entity.components[componentName];
				mapDeleteFromSet(componentName, entityId, this._components);

				return commands;
			},
			despawn: () => {
				this._entities.delete(entityId);
				Object.keys(entity.components).forEach(componentName => {
					mapDeleteFromSet(componentName, entityId, this._components);
				});
			}
		};

		return commands;
	};

	/**
	 * Creates a new entity and returns a reference to it.
	 */
	spawn = () => {
		const entity: Entity = {
			id: this._nextId++,
			components: {}
		};
		this._entities.set(entity.id, entity);

		return this.entity(entity.id)!;
	};

	/**
	 * Registers a system with this engine.
	 *
	 * @param system The system to register.
	 */
	addSystem = <T extends System>(system: T) => {
		this._systems.push(system);
		return this;
	};

	/**
	 * Code that runs on each frame. This will run all systems sequentially, in the order they were added.
	 *
	 * @param timeDelta The time since the last frame.
	 */
	private onNewFrame = (timeDelta: number) => {
		const query: Query<AnyComponentList> = {
			required: (...components) => {
				if (components.length === 0) return this._entities.values();

				let entities: Entity[] | undefined;
				components.forEach(componentName => {
					if (!entities) {
						entities = Array.from(this._components.get(componentName) ?? new Set<EntityId>())
							.map(id => this._entities.get(id)!);
						return;
					}

					entities = entities.filter(entity => !!entity.components[componentName]);
				});

				// TODO: Don't use any
				return (entities ?? []) as any;
			},
			// TODO: Fix
			optional: () => [],
			// TODO: Fix
			entities: () => [],
		};

		this._systems.forEach(system => {
			system(query, { engine: this, timeDelta });
		});
	};

	/**
	 * Starts the engine. This will start the engine's main loop.
	 */
	run = () => {
		const handleTick = (time: number) => {
			this._previousTime = this._previousTime ?? time;
			const delta = time - this._previousTime;
			this._previousTime = time;

			this.onNewFrame(delta);

			requestAnimationFrame(handleTick);
		}

		requestAnimationFrame(handleTick);
	};
}
