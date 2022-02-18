<script>
  import CloseLine from 'svelte-remixicon/lib/icons/CloseLine.svelte';
  import CommandLine from 'svelte-remixicon/lib/icons/CommandLine.svelte';
  import WifiLine from 'svelte-remixicon/lib/icons/WifiLine.svelte';
  import CellphoneLine from 'svelte-remixicon/lib/icons/CellphoneLine.svelte';
  import SignalwifioffLine from 'svelte-remixicon/lib/icons/SignalwifioffLine.svelte';
  import BatteryLine from 'svelte-remixicon/lib/icons/BatteryLine.svelte';
  import Signalwifi3Line from 'svelte-remixicon/lib/icons/Signalwifi3Line.svelte';
</script>
<div class="container container--footer">
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
                <SignalwifioffLine size="22"/>
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
                <Signalwifi3Line size="22"/>
            </div>
            <p class="footer-item__title footer-item__title--right">GPS</p>
        </div>
        <div class="footer-item">
            <p class="footer-item__title">14:23</p>
        </div>
    </div>
</div>
  <style lang="scss">
      .container--footer {
        position: fixed;
        left: 0;
        bottom: 0;
        width: 100%;
        z-index: 1;
        .content-container {
            position: relative;
            cursor: default;
            display: flex;
            flex-flow: row wrap;
            justify-content: center;
            .footer-item {
                position: relative;
                padding: .5rem .5rem;
                background-color: var(--gray5);
                font-size: .75rem;
                line-height: 20px;
                color: var(--gray2);
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
                &__desc {
                    position: relative;
                    display: inline-block;
                    margin: 0 .25rem 0 0;
                }

                &--large {
                    font-size: 14px;
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
                }
                &:last-child {
                    margin-left: 2px;
                    color: var(--gray1);
                }
            }
          } 
      }
  </style>

