import { Engine } from './Engine';

export type Component<N extends string, T> = T & {
	name: N,
};

export type AnyComponent = Component<string, unknown>;
export type AnyComponentList = AnyComponent[];

export type ComponentsWithName<Components extends AnyComponentList, Name extends string> = Extract<Components[number], { name: Name }>;
export type ComponentNames<Components extends AnyComponentList> = Components[number]['name'];

export type EntityId = number;

export type Entity = {
	id: EntityId,
	components: Record<string, AnyComponent>,
};

export type EntityWithComponents<Components extends AnyComponentList> = Entity & {
	components: { [key in ComponentNames<Components>]: ComponentsWithName<Components, key> }
}

export type EntityWithOptionalComponents<Components extends AnyComponentList> = Entity & {
	components: { [key in ComponentNames<Components>]?: ComponentsWithName<Components, key> }
}

export type Query<Components extends AnyComponentList> = {
	required: <Names extends ComponentNames<Components>[]>(...components: Names) => Array<EntityWithComponents<Array<ComponentsWithName<Components, Names[number]>>>>,
	optional: <Names extends ComponentNames<Components>[]>(...components: Names) => Array<EntityWithOptionalComponents<Array<ComponentsWithName<Components, Names[number]>>>>,
	entities: <RequiredComponentNames extends ComponentNames<Components>[], OptionalComponentNames extends ComponentNames<Components>[]>
		(required: RequiredComponentNames, optional: OptionalComponentNames) =>
			Array<
				EntityWithComponents<Array<ComponentsWithName<Components, RequiredComponentNames[number]>>>
				& EntityWithOptionalComponents<Array<ComponentsWithName<Components, OptionalComponentNames[number]>>>
			>,
}

/**
 * Parameters that will be provided to a System.
 */
export type SystemParams = {
	/**
	 * A reference to the current engine.
	 */
	engine: Engine,

	/**
	 * The time since the last frame in milliseconds.
	 */
	timeDelta: number,
};

/**
 * A function that will be called each frame that can be used to update the state of the engine and entities / components.
 */
// TODO: Figure out a better type for T, it shouldn't need any
export type System = <T extends Query<any>>(query: T, params: SystemParams) => void;