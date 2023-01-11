<script lang="ts">
import HomeHeader from './../components/blocks/HomeHeader.vue';
import HomeFooter from './../components/blocks/HomeFooter.vue';
import HomeMain from './../components/blocks/HomeMain.vue';

export default {
  components: { HomeHeader, HomeFooter, HomeMain },
};
</script>

<template>
  <div class="container">
    <HomeHeader class="header" />
    <HomeMain class="main" />
    <HomeFooter class="footer" />
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.main {
  flex-grow: 1;
}
</style>
