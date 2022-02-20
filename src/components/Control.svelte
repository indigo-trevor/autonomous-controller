
<script>
import { createScene } from "./scene";
import { onMount } from 'svelte';

  let el;
  
  // Show babylon scene
  onMount( () => {
		createScene(el)
	});

</script>
<div class="container container--control">
  <!-- Babylon FPV -->
  <div class="section section--fpv" x={40}>
    <canvas bind:this={el}></canvas>
  </div>
  <div class="section section--map">
    <h1>Mini Map</h1>
  </div>

</div>
<style lang="scss">
    .container--control {
      position: absolute;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: row;
      z-index: 1;
      button {
        position: fixed;
        top: 100px;
        left: 100px;
        z-index: 10;
      }
      .section--fpv {
        position: relative;
        width: 75%;
        height: 100%;
        background-color: var(--gray2);

        canvas {
            position: relative;
            width: 100%;
            height: auto;
            display: block;
            z-index: 1;
            min-width: 100%;
            min-height: 100%;
            left: 50%;
            top: 50%;
            transform: translate(-50%,-50%);
        }
      }
      .section--map {
        position: relative;
        width: 25%;
        height: 100%;
        background-color: var(--gray3);
      }
    }

</style>

