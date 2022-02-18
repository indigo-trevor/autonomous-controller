<script>
  import Header from './components/Header.svelte';
  import LeftBar from './components/LeftBar.svelte';
  import RightBar from './components/RightBar.svelte';
  import Footer from './components/Footer.svelte';
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
        <Header></Header>
        <LeftBar></LeftBar>
        <RightBar></RightBar>
        <Footer></Footer>
    </div>
</section>
