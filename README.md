# Chrome Trex Game 
# Built using Phaser & Webpack

A modern, modular boilerplate to kickstart game development using [Phaser 3](https://phaser.io/phaser3) and Webpack 4. This setup supports live reloading during development, optimized production builds, ES6+ transpilation via Babel, and convenient deployment workflows.

---

## 🚀 Features

- ✅ Phaser 3 framework
- ✅ Webpack 4 for bundling
- ✅ Babel for modern JavaScript support
- ✅ Live reloading with `webpack-dev-server`
- ✅ Clean, optimized production build
- ✅ HTML templating and asset copying
- ✅ Easy deployment (GitHub Pages / Netlify)

---

## ⚙ Requirements

Make sure you have the following installed:

- **Node.js**: `>=12.x` (LTS recommended)
- **npm**: `>=6.x` (comes with Node.js)

Check versions:

```bash
node -v
npm -v


🎮 Game Loop Overview
Phaser uses a classic game loop pattern with the following lifecycle methods:

preload(): Load all assets before the game starts.

create(): Initialize game objects, input handlers, and animations.

update(time, delta): Runs 60 times per second to update game logic (e.g., movement, collision, score tracking).


Referece is taken from the work of @dawidadach