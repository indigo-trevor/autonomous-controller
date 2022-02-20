<script>
    import Header from './components/Header.svelte';
    import LeftBar from './components/LeftBar.svelte';
    import RightBar from './components/RightBar.svelte';
    import Footer from './components/Footer.svelte';
    import Control from './components/Control.svelte';
    import Variation1 from './components/Variation1.svelte';
    import { showControl } from './components/stores.js';

    console.log($showControl)
</script>

<style lang="scss">
    :global {
        @import 'globalStyles.scss';
    }
</style>

<!-- Header -->
<section class="l-section">
    <div class="l-container">
        <Header></Header>
        <LeftBar></LeftBar>
        <RightBar></RightBar>
        <Footer></Footer>
        {#if $showControl}
        <!-- Test = Control -->
            <Control></Control>
        {:else}
        <!-- Test = Variation 1 -->
            <Variation1></Variation1>
        {/if}
        
    </div>
</section>

