<script>
  import { LottiePlayer } from '@lottiefiles/svelte-lottie-player';
  import { showIntro, loadBabylon } from './stores.js';

  const toggleIntro = () => { 
        $showIntro = !$showIntro 
        $loadBabylon = !$loadBabylon
    }

</script>
<div class="container container--intro">
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
</div>
<style lang="scss">
    .container--intro {
      position: absolute;
      width: 100%;
      height: 100%;
      z-index: 4;
      background-color: var(--gray5);
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
        box-shadow: 0px 2px 4px var(--black);
        transition: all 150ms ease;
        @media only screen and (max-width: 930px) and (orientation: portrait) {
           margin-top: 2rem;
        }
        @media only screen and (max-width: 930px) {
          margin-top: 1rem;
          padding: .75rem 2.5rem;
        }
        &:hover {
          background-color: var(--gray6);
          border-color: var(--blue1);
        }
        &:active {
          transform: scale(0.95);
        }
      }
    }

</style>

