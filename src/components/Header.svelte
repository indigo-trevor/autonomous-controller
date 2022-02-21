<script>
  
</script>
<header class="header">
    <div class="content-container">
        <div class="header-item">
            <p class="header-item__title">Elapsed</p>
            <p class="header-item__desc">05:04</p>
        </div>
        <div class="header-item">
            <p class="header-item__title">BRG</p>
            <p class="header-item__desc">085°M/9000m</p>
        </div>
        <div class="header-item">
            <p class="header-item__title">AGL</p>
            <p class="header-item__desc">≥70'</p>
        </div>
        <div class="header-item">
            <p class="header-item__title">MSL</p>
            <p class="header-item__desc">5,325'</p>
        </div>
        <div class="header-item">
            <p class="header-item__title">HDG</p>
            <p class="header-item__desc">098°M</p>
        </div>
        <div class="header-item">
            <p class="header-item__title">Location</p>
            <p class="header-item__desc">11SMS 84266 19741</p>
        </div>
    </div>
</header>
  <style lang="scss">
      .header {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        background-color: var(--gray5);
        box-shadow: 0px 1px 12px 8px var(--gray5);
        cursor: default;
        z-index: 2;
        .content-container {
            position: relative;
            display: flex;
            flex-flow: row wrap;
            justify-content: center;
            @media only screen and (max-width: 415px) and (orientation: portrait) {
                flex-flow: row nowrap;
                overflow-x: scroll;
                overflow-y: hidden;
                justify-content: flex-start;
                flex-basis: max-content;
                height: 48px;
            }
            .header-item {
                position: relative;
                padding: .5rem 1rem .25rem 1rem;
                font-size: .75rem;
                &:after {
                    content: '';
                    position: absolute;
                    width: 1px;
                    height: 12px;
                    background-color: var(--gray2);
                    right: 0;
                    top: 9px;
                }
                &__title {
                    position: relative;
                    display: inline-block;
                    color: var(--gray1);
                    margin: 0 .25rem 0 0;
                }
                &__desc {
                    position: relative;
                    display: inline-block;
                    margin: 0 .25rem 0 0;
                }
                &:nth-child(6) {
                    margin-right: 0;
                    padding-right: 0;
                    &:after {
                        display: none;
                    }
                }
            }
          } 
      }
  </style>

