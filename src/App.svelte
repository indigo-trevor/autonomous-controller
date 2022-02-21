<script>
    import Intro from './components/Intro.svelte';
    import Header from './components/Header.svelte';
    import LeftBar from './components/LeftBar.svelte';
    import RightBar from './components/RightBar.svelte';
    import Footer from './components/Footer.svelte';
    import Control from './components/Control.svelte';
    import Variation1 from './components/Variation1.svelte';
    import { showControl, showIntro, loadBabylon } from './components/stores.js';
</script>

<style lang="scss">
    :global {
        @import 'globalStyles.scss';
    }
    .intro-container {
        opacity: 1;
        visibility: visible;
        transition: all 1s ease;
        &.active {
            opacity: 0;
            visibility: hidden;
        }
    }
</style>

<!-- Header -->
<section class="l-section">
    <div class="l-container">
        <div class="intro-container {$showIntro === true ? 'active' : ''}">
            <Intro></Intro>
        </div>
        <Header></Header>
        <LeftBar></LeftBar>
        <RightBar></RightBar>
        <Footer></Footer>
        {#if $showControl && $loadBabylon}
        <!-- Test = Control -->
        <Control></Control>
        {/if}
        {#if !$showControl && $loadBabylon}
        <!-- Test = Variation 1 -->
            <Variation1></Variation1>
        {/if}
        
    </div>
</section>
