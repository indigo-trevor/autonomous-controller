# Autonomous Controller

Creating a prototype of an autonomous controller to be used for AB tests. The operator has access to a 360 degree FPV via a drone and has the the ability to move around 360 degrees space at their leisuer. 

## The test two variations:
1. <b>Control -</b> Side by side view in which the user will have the ability to drag the screen to toggle width of sections.
2. <b>Variation 1 -</b> Picture in picture layout in which the user can toggle which view takes up the large view. 

<b>*You can toggle the test variation by clicking the settings gear icon in the top left of your screen.</b>

## Staging site
[https://autonomous-controller.vercel.app](https://autonomous-controller.vercel.app/)

## Known issues
- Need to sync up the Map section with the movement from the FPV feature.  Currently I have the drone in the map moving independently using Keyframes.
- On the Control variation, need to implement the drag to resize window feature. 
- Implement a Thermal view of the FPV. This all depends on the FPV source and format so it could be achieved in various ways. 
- The Header and Footer values are currently static.  Would be nice to make these dynamic based on your movements and actions. 

## What is used
- [Svelte](https://svelte.dev/)
- [SASS](https://sass-lang.com/)
- [BEM](http://getbem.com/)
- [Babylon.js](https://www.babylonjs.com/)
- [Lottie](https://airbnb.io/lottie/#/)

## Get started

Install the dependencies...

```bash
npm install
```

...then start [Rollup](https://rollupjs.org):

```bash
npm run dev
```

...to build:

```bash
npm run build
```
