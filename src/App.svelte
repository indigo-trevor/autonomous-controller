<script>
  import LeftBar from './components/LeftBar.svelte';
  import RightBar from './components/RightBar.svelte';
</script>

<!-- use lang="sass" for SASS -->
<style lang="scss">
    :global {
        @import 'globalStyles.scss';
    }
</style>

<!-- Header -->
<section class="l-section">
    <div class="l-container">
        <LeftBar></LeftBar>
        <RightBar></RightBar>
    </div>
</section>
