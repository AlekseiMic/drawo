<script lang="ts">
import HomeHeader from './../components/blocks/HomeHeader.vue';
import HomeFooter from './../components/blocks/HomeFooter.vue';
import HomeMain from './../components/blocks/HomeMain.vue';

export default {
  components: { HomeHeader, HomeFooter, HomeMain },
};
</script>

<template>
  <HomeHeader />
  <HomeMain />
  <HomeFooter />
</template>

<style></style>
