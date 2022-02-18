
<script>
import { onMount } from 'svelte';
import { createScene } from "./scene";

  let el;
  
  function handleClick() {
      console.log("play video")
      createScene(el)
	}

</script>
<div class="container container--fpv">
    <canvas bind:this={el}></canvas>

    <button on:click={handleClick}>Render Video</button>
</div>
<style lang="scss">
    .container--fpv {
      position: absolute;
      left: 0;
      top: 0;
      width: 50%;
      height: 100%;
      background-color: var(--gray4);
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
button {
    position: fixed;
    top: 100px;
    left: 100px;
    z-index: 10;
}

</style>

