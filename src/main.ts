import { isPosition, isRadius, position, velocity } from './components';
import { getEntities } from './entities';
import { updateEntityPositionWithVelocity } from './systems';

const canvas = document.querySelector('canvas');

if (!canvas) throw new Error('Canvas not found');
const ctx = canvas.getContext('2d');
if (!ctx) throw new Error('Unable to initialise canvas context!');

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

const { entities, components } = getEntities(canvas);

let prevTime: DOMHighResTimeStamp | undefined;
const renderFrame = (time: DOMHighResTimeStamp) => {
	if (!prevTime) prevTime = time;

	const delta = time - prevTime;

	prevTime = time;

	// Clear the canvas
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// Run systems
	components.forEach((entitiesWithComponent, component) => {
		switch (component) {
			case 'velocity':
				entitiesWithComponent.forEach(entity => updateEntityPositionWithVelocity(entity, entities, delta));
				break;
		}
	});

	// Draw
	components.get('position')?.forEach(entity => {
		const position = entity.components.find(isPosition);
		const radius = entity.components.find(isRadius);

		if (!position || !radius) throw new Error('Missing position or radius component!');

		ctx.beginPath();
		ctx.arc(position.data.x, position.data.y, radius.data, 0, 2 * Math.PI);
		ctx.fillStyle = '#000';
		ctx.fill();
	});

	requestAnimationFrame(renderFrame);
};

requestAnimationFrame(renderFrame);