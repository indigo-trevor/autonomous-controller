
<script>
import Video from "./Video";
import { onMount } from 'svelte';

import { LottiePlayer } from '@lottiefiles/svelte-lottie-player';

  let canvas;
  // Show babylon scene
  onMount(async () => {
    let scene = new Video(canvas);
    scene.setup();
    scene.run();
	});

</script>
<div class="container container--control">
  <!-- Babylon FPV -->
  <div class="section section--fpv">
    <canvas bind:this={canvas} id="app"></canvas>
  </div>
  <div class="section section--map">
    <div class="drone-container">
      <LottiePlayer
        src="build/assets/map-drone.json"
        autoplay="{true}"
        loop="{true}"
        controls="{false}"
        renderer="svg"
        background="transparent"
        height="{'100%'}"
        width="{'100%'}"
      />
    </div>
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
      @media only screen and (max-width: 930px) and (orientation: portrait) {
        flex-wrap: wrap;
      }
      .section--fpv {
        position: relative;
        width: 50%;
        height: 100%;
        background-color: var(--gray4);
        z-index: 2;
        @media only screen and (max-width: 930px) and (orientation: landscape) {
          width: 60%;
        }
        @media only screen and (max-width: 930px) and (orientation: portrait) {
           width: 100%;
           height: 70%;
        }
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
        overflow-x: visible;
        z-index: 3;
        width: 50%;
        height: 100%;
        background-color: var(--gray4);
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        border-left: 4px solid var(--gray2);
        background-image: linear-gradient(rgba(#232932, 0.7), rgba(#232932, 0.7)), url("assets/grid.png");
        background-repeat: repeat;
        background-size: 300px 400px;
        
        @media only screen and (max-width: 930px) and (orientation: landscape) {
          width: 40%;
        }
        @media only screen and (max-width: 930px) and (orientation: portrait) {
          width: 100%;
          height: 30%;
          border-left: none;
          border-top: 2px solid var(--gray2);
        }
        &:after {
          content: '';
          position: absolute;
          top: calc(50% - 24px);
          left: -7px;
          width: 12px;
          height: 80px;
          border-radius: 8px;
          background-color: var(--gray1);
          box-shadow: 0px 2px 4px var(--gray5);
          transition: all 150ms ease;
          cursor: pointer;
          @media only screen and (max-width: 930px) and (orientation: landscape) {
            top: calc(50% - 40px);
          }
          @media only screen and (max-width: 930px) and (orientation: portrait) {
            top: -6px;
            left: calc(50% - 28px);
            width: 55px;
            height: 10px;
          }
          &:hover {
            box-shadow: 0px 2px 10px var(--gray5);
          }
        }
        .drone-container {
          color: var(--white);
          max-width: 150px;
          animation: moveDrone 51s infinite;
          animation-timing-function: linear;
          @media only screen and (max-width: 930px) and (orientation: landscape) {
            animation: moveDroneLand 51s infinite;
           animation-timing-function: linear;  
          }
          @media only screen and (max-width: 930px) and (orientation: portrait) {
            animation: moveDronePort 51s infinite;
           animation-timing-function: linear;  
          }
        }
      }
    }

    @keyframes moveDrone {
        0%    { transform: translateY(300%); }
        100%  { transform: translateY(0); }
      }

      @keyframes moveDroneLand {
        0%    { transform: translateY(100%); }
        100%  { transform: translateY(0); }
      }
      @keyframes moveDronePort {
        0%    { transform: translateY(50%); }
        100%  { transform: translateY(-50%); }
      }
</style>

