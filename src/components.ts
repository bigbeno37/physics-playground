import { Vector } from './vector';

type Component<N extends string, T> = {
	name: N,
	data: T,
};

/**
 * Represents a position on the canvas. NOTE: This is based on (0,0) being in the top left, and increasing in value
 * as you move to the right and down.
 */
export type Position = Component<'position', Vector>;
export const position = (x: number, y: number): Position => ({name: 'position', data: {x, y}});

/**
 * Represents the mass of an entity, used to calculate acceleration / velocity changes each tick.
 */
export type Mass = Component<'mass', number>;
export const mass = (mass: number): Mass => ({name: 'mass', data: mass});

/**
 * Represents the radius of an entity, used to render an entity. NOTE: Radius is not used to calculate acceleration /
 * velocity changes; See the mass component for that.
 */
export type Radius = Component<'radius', number>
export const radius = (radius: number): Radius => ({name: 'radius', data: radius});

/**
 * Represents the velocity of an entity, used to update the position of an entity each tick.
 */
export type Velocity = Component<'velocity', Vector>;
export const velocity = (x: number, y: number): Velocity => ({name: 'velocity', data: {x, y}});

export type AvailableComponents = Position | Mass | Radius | Velocity;

export const isPosition = (component: AvailableComponents): component is Position => component.name === 'position';
export const isRadius = (component: AvailableComponents): component is Radius => component.name === 'radius';
export const isVelocity = (component: AvailableComponents): component is Velocity => component.name === 'velocity';
export const isMass = (component: AvailableComponents): component is Mass => component.name === 'mass';