<script>
    import Settings5Line from 'svelte-remixicon/lib/icons/Settings5Line.svelte';
    import VidiconLine from 'svelte-remixicon/lib/icons/VidiconLine.svelte';
    import ArrowUpSLine from 'svelte-remixicon/lib/icons/ArrowUpSLine.svelte';
    import { showControl, navActive } from './stores.js';
    
    const toggleNav = () => { 
        $navActive = !$navActive 
    }

    const toggleVariation = () => { 
        $showControl = !$showControl 
        $navActive = !$navActive
    }

</script>
<div class="container container--left-bar">
    <button class="icon-button" on:click={toggleNav}> 
        <Settings5Line size="28"/>
    </button>
   
    <div class="test-nav {$navActive === true ? 'active' : ''}">
        <div class="test-nav__inner">
            <h4>Test Variation</h4>
            <p on:click={toggleVariation} class="{$showControl === true ? 'active' : ''}">Control</p>
            <p on:click={toggleVariation} class="{$showControl === false ? 'active' : ''}">Variation 1</p>
        </div>
    </div>

    <button class="icon-button icon-button--video"> 
        <VidiconLine size="28"/>
    </button>
    <button class="icon-button icon-button--chevron"> 
        <ArrowUpSLine size="40"/>
    </button>
</div>
  <style lang="scss">
      .container--left-bar {
        position: absolute;
        z-index: 3;
        left: 0;
        top: 0;
        padding: 3.5rem 1rem 1rem 1rem;
        height: calc(100vh - 4.5rem);
        background-color: transparent;
        display: flex;
        flex-direction: column;
        @media only screen and (max-width: 930px) and (orientation: portrait) {
            padding: 5.5rem .5rem .5rem .5rem;
            height: calc(100vh - 6rem);
        }
          .icon-button {
              border: none;
              position: relative;
              text-align: center;
              z-index: 3;
              background-color: var(--gray5);
              transition: all 150ms ease;
              cursor: pointer;
              border-radius: 100%;
              transform: scale(1);
              color: var(--gray1);
              margin-bottom: 1rem;
              width: 50px;
              height: 50px;
              display: flex;
              flex-direction: row;
              justify-content: center;
              align-items: center;
              box-shadow: 0px 2px 4px var(--gray5);
              &--chevron {
                width: 65px;
                height: 65px;
                position: -webkit-sticky;
                position: sticky;
                margin-top: auto;
                margin-bottom: 0;
                bottom: 0;
                @media only screen and (max-width: 930px) and (orientation: portrait) {
                    bottom: 50px;
                  }
              }
              &:hover {
                color: var(--blue3);
              }
              &:active {
                color: var(--blue3);
                transform: scale(0.95);
              }
               &--video {
                color: var(--blue3);
              }
          } 
          .test-nav {
              position: absolute;
              z-index: 2;
              width: 115px;
              left: 70px;
              top: 55px;
              background-color: var(--gray5);
              text-align: left;
              border-radius: 8px;
              opacity: 0;
              visibility: hidden;
              transform: translateX(-100px) translateY(-20px) scale(0);
              transition: all 150ms ease-in-out;
              &__inner {
                  padding: 1rem;
                  font-size: .75rem;
                  h4 {
                    margin: 0 0 .5em 0;
                    font-weight: 700;
                  }
                  p {
                      margin: 0 0 .25rem 0 ;
                      transition: all 150ms ease;
                      cursor: pointer;
                      &:hover {
                          color: var(--blue3);
                        }
                        &.active {
                          pointer-events: none;
                          color: var(--blue3);
                      }
                  }
              }
              &.active {
                visibility: visible;
                opacity: 1;
                transform: translateX(0) translateY(0) scale(1);
              }
          }
      }
  </style>

