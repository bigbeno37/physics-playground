import {
	AvailableComponent,
	AvailableComponentName,
	AvailableComponents,
} from './components';

export type EntityId = number;

export type Entity = {
	id: EntityId,
	components: {
		[key in AvailableComponentName]?: AvailableComponents[key]
	}
};

export type EntityWithComponents<T extends Array<AvailableComponent>> = Entity & {
	components: {
		[key in T[number]['name']]: AvailableComponents[key]
	}
};