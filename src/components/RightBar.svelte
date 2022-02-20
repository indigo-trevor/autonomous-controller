<script>
    import PencilLine from 'svelte-remixicon/lib/icons/PencilLine.svelte';
    import Ruler2Line from 'svelte-remixicon/lib/icons/Ruler2Line.svelte';
    import CommandLine from 'svelte-remixicon/lib/icons/CommandLine.svelte';
</script>
<div class="container container--right-bar">
    <button class="icon-button"> 
        <PencilLine size="28"/>
    </button>
    <button class="icon-button icon-button--ruler"> 
        <Ruler2Line size="28"/>
    </button>
    <button class="icon-button icon-button--command"> 
        <CommandLine size="22"/>
    </button>
</div>
  <style lang="scss">
      .container--right-bar {
        position: absolute;
        z-index: 3;
        right: 0;
        top: 0;
        padding: 3.5rem 1rem 1rem 1rem;
        height: calc(100vh - 4.5rem);
        background-color: transparent;
        display: flex;
        flex-direction: column;
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
                }
                &:hover {
                    color: var(--blue2);
                }
                &:active {
                    color: var(--blue2);
                    transform: scale(0.95);
                }
                &--ruler {
                    transform: rotate(270deg);
                    &:active {
                        transform: scale(0.95) rotate(270deg);
                    }
                }
          } 
      }
  </style>

