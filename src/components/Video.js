import * as BABYLON from 'babylonjs';

export default class Video {

  constructor(canvas) {
		this.engine = new BABYLON.Engine(canvas, true);
		this.scene = new BABYLON.Scene(this.engine);
		// this.scene.debugLayer.show();
	}


  setup() {
    this.camera = new BABYLON.ArcRotateCamera("Camera", -Math.PI / 2,  Math.PI / 2, 5, BABYLON.Vector3.Zero(), this.scene);
    this.camera.attachControl(this.canvas, true);

      var videoDome = new BABYLON.VideoDome(
        "videoDome",
        ["/build/assets/space-station.mp4"],
        {
            resolution: 64,
            clickToPlay: true,
            autoPlay: true
        },
        this.scene
    );
	}
  
  
  run() {
    this.engine.runRenderLoop(() => {
      this.scene.render();
    });
    window.addEventListener('resize', () => {
      console.log("screen resized")
      this.engine.resize();
    });
	}
 
}
