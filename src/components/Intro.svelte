<script>
  import { LottiePlayer } from '@lottiefiles/svelte-lottie-player';
  import { showIntro, loadBabylon } from './stores.js';

  const toggleIntro = () => { 
        $showIntro = !$showIntro 
        $loadBabylon = !$loadBabylon
    }

</script>
<section class="section section--intro">
  <div class="inner">
    <h1>Autonomous Controller</h1>
    <div class="drone-container">
      <LottiePlayer
        src="build/assets/intro.json"
        autoplay="{true}"
        loop="{true}"
        controls="{false}"
        renderer="svg"
        background="transparent"
        height="{'100%'}"
        width="{'100%'}"
      />
    </div>
    <button class="button" on:click={toggleIntro}>Get started</button>
  </div>
</section>
<style lang="scss">
    .section--intro {
      position: fixed;
      width: 100vw;
      height: 100vh;
      top: 0;
      left: 0;
      z-index: 4;
      background-color: var(--gray5);
      background-image: linear-gradient(rgba(35, 41, 50, 0.9), rgba(35, 41, 50, 0.9)), url("assets/da-grid.png");
      background-repeat: no-repeat;
      background-size: 100% 100%;
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      text-align: center;
      h1 {
        position: relative;
        margin: 0 auto .5rem auto;
        font-size: 4rem;
        display: inline-block;
        @media only screen and (max-width: 930px) and (orientation: portrait) {
           margin-bottom: 2rem;
        }
        @media only screen and (max-width: 930px) {
            font-size: 2.5rem;
        }
      }
      .drone-container {
        position: relative;
        width: 100%;
        max-width: 500px;
        margin: 0 auto;
        @media only screen and (max-width: 930px) {
           max-width: 300px;
        }
        @media only screen and (max-width: 930px) and (orientation: landscape) {
           max-width: 175px;
        }
      }
      .button {
        font-family: var(--font-family);
        font-size: 1rem;
        background-color: transparent;
        color: var(--white);
        padding: 1rem 3rem;
        border: 2px solid var(--blue2);
        border-radius: 100px;
        cursor: pointer;
        position: relative;
        margin-top: 1.5rem;
        transform: scale(1);
        box-shadow: 0px 2px 4px var(--gray6);
        transition: all 150ms ease;
        @media only screen and (max-width: 930px) and (orientation: portrait) {
           margin-top: 2rem;
        }
        @media only screen and (max-width: 930px) {
          margin-top: 1rem;
          padding: .75rem 2.5rem;
        }
        &:hover {
          background-color: rgba(#161616, 0.35);
          border-color: var(--blue1);
        }
        &:active {
          transform: scale(0.95);
        }
      }
    }

</style>

