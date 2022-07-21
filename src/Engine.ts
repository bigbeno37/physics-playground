import { GetEntities, System } from './systems';
import { Entity, EntityId } from './entities';
import { AvailableComponent, AvailableComponentName } from './components';
import { mapAddToSet, mapDeleteFromSet } from './utils';

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
	insert: (component: AvailableComponent) => EntityCommands,

	/**
	 * Removes the given component from this Entity if it exists.
	 *
	 * @param component The component to remove.
	 */
	remove: (component: AvailableComponentName) => EntityCommands,

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
	private _components = new Map<AvailableComponentName, Set<EntityId>>();

	/**
	 * All systems registered with this engine.
	 * @private
	 */
	private _systems: System[] = [];

	/**
	 * Whether or not the engine is currently paused.
	 * @private
	 */
	private _paused = false;

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
				// Tried `entity.components[component.name] = component`, but Typescript complained that because it
				// *could* be undefined, it would be invalid. Strictly speaking `entity.components[component.name]` could
				// be undefined here, but cast it as AvailableComponent anyway as it doesn't matter (it will get overridden)
				(entity.components[component.name] as AvailableComponent) = component;
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
	addSystem = (system: System) => {
		this._systems.push(system);
		return this;
	};

	/**
	 * Code that runs on each frame. This will run all systems sequentially, in the order they were added.
	 *
	 * @param timeDelta The time since the last frame.
	 */
	private onNewFrame = (timeDelta: number) => {
		const getEntities: GetEntities = (...components) => {
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

			// Might be able to make this more typesafe, but it's venturing into the dark arts...
			return (entities ?? []) as unknown as ReturnType<GetEntities>;
		};

		this._systems.forEach(system => {
			system({ engine: this, timeDelta, getEntities });
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

			if (this._paused) return;
			requestAnimationFrame(handleTick);
		}

		requestAnimationFrame(handleTick);
	};

	/**
	 * Pauses the engine.
	 */
	pause = () => this._paused = true;

	/**
	 * Resumes the engine.
	 */
	resume = () => {
		this._paused = false;
		this.run();
	}
}
