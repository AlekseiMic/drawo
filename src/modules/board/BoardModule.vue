<script lang="ts">
import HomeFooter from '../../components/blocks/HomeFooter.vue';
import HomeHeader from '../../components/blocks/HomeHeader.vue';
import HomeMain from '../../components/blocks/HomeMain.vue';

export default {
  components: {
    HomeHeader,
    HomeMain,
    HomeFooter,
  },
};
</script>

<template>
  <HomeHeader />
  <HomeMain />
  <HomeFooter />
</template>

<style>
nav {
  display: flex;
  flex-direction: row;
  column-gap: 10px;
}
</style>
