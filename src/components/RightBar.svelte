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
        position: fixed;
        right: 0;
        top: 0;
        padding: 1rem;
        height: calc(100vh - 2rem);
        background-color: transparent;
        display: flex;
        flex-direction: column;
          .icon-button {
              border: none;
              display: block;
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
              &--command {
                  border-radius: 8px;
                  position: absolute;
                  bottom: 0;
                  right: 1rem;
                  width: 40px;
                  height: 40px;
                  padding-top: 4px;
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

