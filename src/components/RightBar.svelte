<script>
    import PencilLine from 'svelte-remixicon/lib/icons/PencilLine.svelte';
    import Ruler2Line from 'svelte-remixicon/lib/icons/Ruler2Line.svelte';
    import CommandLine from 'svelte-remixicon/lib/icons/CommandLine.svelte';
    import { showControl } from './stores.js';
</script>
<nav class="nav nav--right-bar {$showControl === false ? 'bottom' : ''}">
    <button class="icon-button"> 
        <PencilLine size="28"/>
    </button>
    <button class="icon-button icon-button--ruler"> 
        <Ruler2Line size="28"/>
    </button>
    <button class="icon-button icon-button--command"> 
        <CommandLine size="22"/>
    </button>
</nav>
  <style lang="scss">
      .nav--right-bar {
        position: absolute;
        z-index: 3;
        right: 0;
        top: 0;
        padding: 3.5rem 1rem 1rem 1rem;
        height: calc(100vh - 4.5rem);
        background-color: transparent;
        display: flex;
        flex-direction: column;
        @media only screen and (max-width: 930px) and (orientation: landscape) {
            padding: 2.5rem 0.5rem 0.5rem 0.5rem;
            height: calc(100vh - 3rem);
        }
          .icon-button {
              border: none;
              position: relative;
              text-align: center;
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
              &--command {
                  border-radius: 8px;
                  width: 40px;
                  height: 40px;
                  position: -webkit-sticky;
                  position: sticky;
                  margin-top: auto;
                  margin-bottom: 0;
                  bottom: 0;
                  @media only screen and (max-width: 930px) and (orientation: portrait) {
                    bottom: 50px;
                    right: -5px;
                  }
                }
                &:hover {
                    color: var(--blue3);
                }
                &:active {
                    color: var(--blue3);
                    transform: scale(0.95);
                }
                &--ruler {
                    transform: rotate(270deg);
                    color: var(--blue3);
                    &:active {
                        transform: scale(0.95) rotate(270deg);
                    }
                }
          } 
          &.bottom {
              height: auto;
              position: absolute;
              top: auto;
              bottom: 0;
              display: block;
              @media only screen and (max-width: 930px) and (orientation: portrait) {
                padding-bottom: 55px;
            }
            .icon-button {
                &--command {
                    margin-top: 100px;
                    bottom: auto;
                    @media only screen and (max-width: 930px) {
                        margin-top: 2rem;
                        transform: translateX(8px);
                    }
                }
            }
          }
      }
  </style>

