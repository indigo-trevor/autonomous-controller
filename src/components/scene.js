import * as BABYLON from 'babylonjs';

export const createScene = (canvas) => {

    const engine = new BABYLON.Engine(canvas, true);
    var scene = new BABYLON.Scene(engine);
    var camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 2,  Math.PI / 2, 5, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, true);

    var videoDome = new BABYLON.VideoDome(
        "videoDome",
        ["/build/assets/space-station.mp4"],
        {
            resolution: 32,
            clickToPlay: true,
            autoPlay: true
        },
        scene
    );

    engine.runRenderLoop(() => {
        scene.render();
      });
    
      window.addEventListener('resize', () => {
        console.log("screen resized")
        engine.resize();
      });

    return scene;
}