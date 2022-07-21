import { mass, position, radius, velocity } from './components';
import { createRenderSystem, physicsSystem } from './systems';
import { Engine } from './Engine';

const canvas = document.querySelector('canvas');

if (!canvas) throw new Error('Canvas not found');
const ctx = canvas.getContext('2d');
if (!ctx) throw new Error('Unable to initialise canvas context!');

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;
const smallestDimension = Math.min(canvas.width, canvas.height);

const engine = new Engine();

const renderSystem = createRenderSystem(ctx);

engine
	.addSystem(physicsSystem)
	.addSystem(renderSystem);

// Planet
engine.spawn()
	.insert(position(canvas.width / 2, (canvas.height / 2) - 150))
	.insert(radius(smallestDimension * 0.02))
	.insert(velocity(0.5, 0))
	.insert(mass(20));

// Sun
engine.spawn()
	.insert(position(canvas.width / 2, canvas.height / 2))
	.insert(radius(smallestDimension * 0.1))
	.insert(velocity(0, 0))
	.insert(mass(40, true));

engine.run();