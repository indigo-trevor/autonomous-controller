<script>
  import CloseLine from 'svelte-remixicon/lib/icons/CloseLine.svelte';
  import CommandLine from 'svelte-remixicon/lib/icons/CommandLine.svelte';
  import WifiLine from 'svelte-remixicon/lib/icons/WifiLine.svelte';
  import CellphoneLine from 'svelte-remixicon/lib/icons/CellphoneLine.svelte';
  import SignalWifiLine from 'svelte-remixicon/lib/icons/SignalWifiLine.svelte';
  import BatteryLine from 'svelte-remixicon/lib/icons/BatteryLine.svelte';
  import SignalWifi3Line from 'svelte-remixicon/lib/icons/SignalWifi3Line.svelte';
</script>
<footer class="footer">
    <div class="content-container">
        <div class="footer-item">
            <p class="footer-item__title">Nova-0023</p>
        </div>
        <div class="footer-item footer-item--large">
            <p class="footer-item__title footer-item__title--left">GPS </p>
            <div class="icon-container icon-container--close">
                <CloseLine size="28" />
            </div>
        </div>
        <div class="footer-item footer-item--large">
            <div class="icon-container icon-container--command">
                <CommandLine size="22"/>
            </div>
            <p class="footer-item__title footer-item__title--right">100%</p>
        </div>
        <div class="footer-item footer-item--large footer-item--icon-only">
            <div class="icon-container icon-container--wifi">
                <WifiLine size="22"/>
            </div>
        </div>
        <div class="footer-item footer-item--large">
            <div class="icon-container icon-container--cell">
                <CellphoneLine size="20"/>
            </div>
            <p class="footer-item__title footer-item__title--right">100%</p>
        </div>
        <div class="footer-item footer-item--large footer-item--icon-only">
            <div class="icon-container icon-container--wifi">
                <SignalWifiLine size="22"/>
            </div>
        </div>
        <div class="footer-item footer-item--large">
            <div class="icon-container icon-container--battery">
                <BatteryLine size="20"/>
            </div>
            <p class="footer-item__title footer-item__title--right">100%</p>
        </div>
        <div class="footer-item footer-item--large">
            <div class="icon-container icon-container--wifi-gps">
                <SignalWifi3Line size="22"/>
            </div>
            <p class="footer-item__title footer-item__title--right">GPS</p>
        </div>
        <div class="footer-item">
            <p class="footer-item__title">14:23</p>
        </div>
    </div>
</footer>
  <style lang="scss">
      .footer {
        position: fixed;
        left: 0;
        bottom: 0;
        width: 100%;
        z-index: 2;
        .content-container {
            position: relative;
            cursor: default;
            display: flex;
            flex-flow: row wrap;
            justify-content: center;
            @media only screen and (max-width: 415px) and (orientation: portrait) {
                flex-flow: row nowrap;
                overflow-x: scroll;
                justify-content: flex-start;
                flex-basis: max-content;
                overflow-y: hidden;
            }
            .footer-item {
                position: relative;
                padding: .5rem .5rem;
                background-color: var(--gray5);
                font-size: .75rem;
                line-height: 20px;
                color: var(--gray2);
                @media only screen and (max-width: 415px) and (orientation: portrait) {
                    padding: .5rem .72rem;
                }
                &__title {
                    position: relative;
                    display: inline-block;
                    margin: 0 0;
                    &--left {
                        padding-right: 1.5rem;
                    }
                    &--right {
                        padding-left: 1.25rem;
                    }
                }

                &--large {
                    font-size: .875rem;
                    color: var(--gray1);
                    .icon-container {
                        position: absolute;
                        color: var(--gray1);
                        &--close {
                            top: 4px;
                            right: 4px;
                            color: var(--gray2);
                        }
                        &--command {
                            top: 7px;
                            left: 4px;
                        }
                        &--wifi {
                            top: 6px;
                            left: 3px;
                            color: var(--blue2);

                            @media only screen and (max-width: 930px) and (orientation: portrait) {
                                left: 0;
                            }
                        }
                        &--cell {
                            top: 8px;
                            left: 5px;
                        }
                        &--battery {
                            top: 8px;
                            left: 5px;
                        }
                        &--wifi-gps {
                            top: 6px;
                            left: 2px;
                            color: var(--blue2);
                        }
                    }
                }
                &--icon-only {
                    position: relative;
                    width: 1rem;
                }
                &:first-child {
                    margin-right: 2px;
                    @media only screen and (max-width: 930px) and (orientation: portrait) {
                        min-width: 62px;
                    }
                }
                &:last-child {
                    margin-left: 2px;
                    color: var(--gray1);
                }
            }
          } 
      }
  </style>

