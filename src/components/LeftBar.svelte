<script>
    import Settings5Line from 'svelte-remixicon/lib/icons/Settings5Line.svelte';
    import VidiconLine from 'svelte-remixicon/lib/icons/VidiconLine.svelte';
    import ArrowUpSLine from 'svelte-remixicon/lib/icons/ArrowUpSLine.svelte';
</script>
<div class="container container--left-bar">
    <button class="icon-button"> 
        <Settings5Line size="28"/>
    </button>
    <button class="icon-button"> 
        <VidiconLine size="28"/>
    </button>
    <button class="icon-button icon-button--chevron"> 
        <ArrowUpSLine size="40"/>
    </button>
</div>
  <style lang="scss">
      .container--left-bar {
        position: relative;
        z-index: 2;
        left: 0;
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
              &--chevron {
                width: 65px;
                height: 65px;
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
          } 
      }
  </style>

