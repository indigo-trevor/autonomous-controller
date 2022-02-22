<script>
  import Video from "./Video";
  import { onMount } from 'svelte';
  import { pipActive } from './stores.js';
  import { LottiePlayer } from '@lottiefiles/svelte-lottie-player';
  import ClockwiseLine from 'svelte-remixicon/lib/icons/ClockwiseLine.svelte';

    let canvas;
    // Show babylon scene
    onMount(async () => {
      let scene = new Video(canvas);
      scene.setup();
      scene.run();
    });
    
    const togglePip = () => { 
        $pipActive = !$pipActive;
    }

  </script>
  <sectiion class="section section--variation1 {$pipActive === true ? 'active' : ''}">
    <button class="icon-button icon-button--flip" on:click={togglePip}> 
        <ClockwiseLine size="20"/>
    </button>
    <!-- Babylon FPV -->
    <div class="container container--fpv">
      <canvas bind:this={canvas} id="app"></canvas>
    </div>
    <div class="container container--map">
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
  </sectiion>
  <style lang="scss">
      .section--variation1 {
        position: absolute;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: row;
        z-index: 1;
        .icon-button--flip {
          border: none;
          position: absolute;
          top: 210px;
          right: 25px;
          text-align: center;
          z-index: 4;
          background-color: var(--gray5);
          transition: all 150ms ease;
          cursor: pointer;
          border-radius: 100%;
          transform: scale(1);
          color: var(--gray1);
          margin-bottom: 1rem;
          width: 30px;
          height: 30px;
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          box-shadow: 0px 2px 4px var(--gray5);
          @media only screen and (max-width: 930px) and (orientation: landscape) {
            top: 113px;
            right: 20px;
          }
          @media only screen and (max-width: 930px) and (orientation: portrait) {
            top: 131px;
            right: 20px;
          }
          &:hover {
              color: var(--blue3);
          }
          &:active {
              color: var(--blue3);
              transform: scale(0.95);
          }
        }
        .container--fpv {
          position: absolute;
          width: 100%;
          height: 100%;
          right: 0;
          top: 0;
          background-color: var(--gray4);
          z-index: 2;
          transition: all 350ms ease;
          cursor: grab;
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
          &:active {
            cursor: grabbing;
          }
        }
        .container--map {
          position: absolute;
          z-index: 3;
          top: 3rem;
          right: 1rem;
          width: 300px;
          height: 200px;
          background-color: var(--gray4);
          display: flex;
          flex-direction: row;
          justify-content: center;
          align-items: center;
          background-image: linear-gradient(rgba(#232932, 0.95), rgba(#232932, 0.95)), url("assets/white-grid.png");
          background-repeat: repeat;
          background-size: 300px 300px;
          box-shadow: 0px 2px 4px var(--gray5);
          transition: all 350ms ease;
          @media only screen and (max-width: 930px) and (orientation: landscape) {
            width: 200px;
            height: 100px;
          }
          @media only screen and (max-width: 930px) and (orientation: portrait) {
            top: 4rem;
            width: 200px;
            height: 100px;
          }
          &:before {
            content: '';
            position: absolute;
            top: 0;
            left: calc(50% - 60px);
            width: 120px;
            height: 100%;
            margin: 0 auto;
            background-color: rgba(#181c23, 0.45);
            @media only screen and (max-width: 930px) {
              width: 120px;
              left: calc(50% - 60px);
            }
          }
          .drone-container {
            color: var(--white);
            max-width: 120px;
            -webkit-animation: moveDronePiP 51s infinite;
            -moz-animation: moveDronePiP 51s infinite;
            animation: moveDronePiP 51s infinite;
            animation-timing-function: linear;
            @media only screen and (max-width: 930px) {
              max-width: 80px;
              -webkit-animation: moveDronePiPMobile 51s infinite;
             -moz-animation: moveDronePiPMobile 51s infinite;
              animation: moveDronePiPMobile 51s infinite;
            }
          }
        }
        &.active {
          .container--fpv {
            z-index: 3;
            top: 3rem;
            right: 1rem;
            width: 300px;
            height: 200px;
            box-shadow: 0px 2px 4px var(--gray5);
            z-index: 3;
            overflow: hidden;
            @media only screen and (max-width: 930px) and (orientation: landscape) {
              width: 200px;
              height: 100px;
            }
            @media only screen and (max-width: 930px) and (orientation: portrait) {
              top: 4rem;
              width: 200px;
              height: 100px;
            }
          }
          .container--map {
            cursor: default;
            box-shadow: none;
            right: 0;
            top: 0;
            width: 100%;
            height: 100%;
            z-index: 2;
            &:before {
              content: '';
              position: absolute;
              top: 0;
              left: calc(50% - 125px);
              width: 250px;
              height: 100%;
              margin: 0 auto;
              background-color: rgba(#181c23, 0.45);
            }
            .drone-container {
              max-width: 150px;
              -webkit-animation: moveDroneFullScreen 51s infinite;
             -moz-animation: moveDroneFullScreen 51s infinite;
              animation: moveDroneFullScreen 51s infinite;
              @media only screen and (max-width: 930px) and (orientation: landscape) {
                -webkit-animation: moveDroneFullScreenLandscape 51s infinite;
                -moz-animation: moveDroneFullScreenLandscape 51s infinite;
                animation: moveDroneFullScreenLandscape 51s infinite;
              }
            }
          }
        }
      }
        // PIP
        @-webkit-keyframes moveDronePiP {
          0%    { -webkit-transform: translateY(85%); }
          100%  { -webkit-transform: translateY(-85%); }
        }
        @-moz-keyframes moveDronePiP {
          0%    { transform: translateY(85%); }
          100%  { transform: translateY(-85%); }
        }
        @keyframes moveDronePiP {
          0%    { transform: translateY(85%); }
          100%  { transform: translateY(-85%); }
        }
        // PIP Mobile
        @-webkit-keyframes moveDronePiPMobile {
          0%    { -webkit-transform: translateY(65%); }
          100%  { -webkit-transform: translateY(-60%); }
        }
        @-moz-keyframes moveDronePiPMobile {
          0%    { transform: translateY(65%); }
          100%  { transform: translateY(-60%); }
        }
        @keyframes moveDronePiPMobile {
          0%    { transform: translateY(65%); }
          100%  { transform: translateY(-60%); }
        }
        // Full screen
        @-webkit-keyframes moveDroneFullScreen {
          0%    { -webkit-transform: translateY(300%); }
           100%  { -webkit-transform: translateY(-150%); }
        }
        @-moz-keyframes moveDroneFullScreen {
          0%    { transform: translateY(300%); }
           100%  { transform: translateY(-150%); }
        }
        @keyframes moveDroneFullScreen {
          0%    { transform: translateY(300%); }
           100%  { transform: translateY(-150%); }
        }
        // Fullscreen landscape
        @-webkit-keyframes moveDroneFullScreenLandscape {
          0%    { -webkit-transform: translateY(100%); }
           100%  { -webkit-transform: translateY(-100%); }
        }
        @-moz-keyframes moveDroneFullScreenLandscape {
          0%    { transform: translateY(100%); }
           100%  { transform: translateY(-100%); }
        }
        @keyframes moveDroneFullScreenLandscape {
          0%    { transform: translateY(100%); }
           100%  { transform: translateY(-100%); }
        }
        // Mobile portrait
        @-webkit-keyframes moveDronePort {
          0%    { -webkit-transform: translateY(50%); }
          100%  { -webkit-transform: translateY(-50%); }
        }
        @-moz-keyframes moveDronePort {
          0%    { transform: translateY(50%); }
          100%  { transform: translateY(-50%); }
        }
        @keyframes moveDronePort {
          0%    { transform: translateY(50%); }
          100%  { transform: translateY(-50%); }
        }
  </style>
  
  