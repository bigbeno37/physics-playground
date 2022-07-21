# Physics Playground
A quick experiment to test out an ECS approach to a planetary body simulation 

## Building
Ensure that NodeJS 14+ is installed on your machine, then run `npm i`.
To build the project, run `npm run build`.
This will build the assets into the `docs/` directory (this was easiest for GitHub pages integration)

## Development
To start the development server, run `npm run dev`, and navigate to `localhost:3000`.

The core logic lives within `src/main.ts`, where the `Engine` is defined.
This Engine makes use of the ECS (Entity Component System) architecture to manage the simulation, and registers entities with components from `src/components.ts`.

There are two major systems at play in `src/systems.ts`, the `physicsSystem` and the `renderSystem`.
The physics system is responsible for updating entities with `Mass` and `Velocity` components based on physics simulations, while the render system is responsible for updating entities with `Position` and `Radius` components, and rendering them to the given Canvas context.