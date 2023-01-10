<script lang="ts">
import { Teleport } from 'vue';
import HomeFooter from '../../components/blocks/HomeFooter.vue';
import HomeHeader from '../../components/blocks/HomeHeader.vue';
import HomeMain from '../../components/blocks/HomeMain.vue';
import OmegaLink from '../../components/ui/OmegaLink.vue';

export default {
  components: {
    HomeHeader,
    HomeMain,
    HomeFooter,
    OmegaLink,
    Teleport: Teleport as any,
  },
};
</script>

<template>
  <HomeHeader />
  <HomeMain />
  <Teleport to="#header-anchor">
    <nav>
      <OmegaLink to="/board/3">Board 3</OmegaLink>
      <OmegaLink to="/board/5">Board 5</OmegaLink>
      <OmegaLink to="/board/">Board</OmegaLink>
      <OmegaLink to="/">Home</OmegaLink>
    </nav>
  </Teleport>
  <HomeFooter />
</template>

<style>
nav {
  display: flex;
  flex-direction: row;
  column-gap: 10px;
}
</style>
