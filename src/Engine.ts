import { GetEntities, System } from './systems';
import { Entity, EntityId } from './entities';
import { AvailableComponent, AvailableComponentName } from './components';

const mapAdd = <K,V>(key: K, value: V, map: Map<K,Set<V>>) => {
	const existing = map.get(key) ?? new Set<V>();
	existing.add(value);
	map.set(key, existing);
};

const mapDelete = <K,V>(key: K, value: V, map: Map<K,Set<V>>) => {
	const existing = map.get(key) ?? new Set<V>();
	existing.delete(value);
	map.set(key, existing);
}

type EntityCommands = {
	insert: (component: AvailableComponent) => EntityCommands,
	remove: (component: AvailableComponentName) => EntityCommands,
	despawn: () => void,
};

export class Engine {
	private _nextId = 0;
	private _entities = new Map<EntityId, Entity>();
	private _components = new Map<AvailableComponentName, Set<EntityId>>();
	private _systems: System[] = [];
	private _paused = false;
	private _previousTime: number | undefined;

	entity = (entityId: EntityId): EntityCommands | undefined => {
		const entity = this._entities.get(entityId);
		if (!entity) {
			return;
		}

		const commands: EntityCommands = {
			insert: component => {
				// Tried `entity.components[component.name] = component`, but Typescript complained that because it
				// *could* be undefined, it would be invalid. Strictly speaking `entity.components[component.name]` could
				// be undefined here, but cast it as AvailableComponent anyway as it doesn't matter (it will get overridden)
				(entity.components[component.name] as AvailableComponent) = component;
				mapAdd(component.name, entityId, this._components);

				return commands;
			},
			remove: componentName => {
				delete entity.components[componentName];
				mapDelete(componentName, entityId, this._components);

				return commands;
			},
			despawn: () => {
				this._entities.delete(entityId);
				Object.keys(entity.components).forEach(componentName => {
					mapDelete(componentName, entityId, this._components);
				});
			}
		};

		return commands;
	};

	spawn = () => {
		const entity: Entity = {
			id: this._nextId++,
			components: {}
		};
		this._entities.set(entity.id, entity);

		return this.entity(entity.id)!;
	};

	addSystem = (system: System) => {
		this._systems.push(system);
		return this;
	};

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

	pause = () => this._paused = true;
	resume = () => {
		this._paused = false;
		this.run();
	}
}
