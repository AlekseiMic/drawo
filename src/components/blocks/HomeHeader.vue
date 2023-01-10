<script lang="ts">
import OmegaLink from '../ui/OmegaLink.vue';
export default {
  components: { OmegaLink },
  mounted: () => {
    console.log('mounted');
  },
  unmounted: () => {
    console.log('unmounted');
  },
  updated: () => {
    console.log('updated');
  },
};
</script>

<template>
  <header>
    <OmegaLink class="logo" to="/">drawo</OmegaLink>
    <div id="header-anchor"></div>
  </header>
</template>

<style scoped>
header {
  height: 50px;
  box-shadow: 0 3px 5px 0px var(--c-default-shadow);
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 0 2rem;
}
#header-anchor {
  flex-grow: 1;
  display: flex;
  justify-content: flex-end;
}
.logo {
  color: var(--c-default-text);
  font-size: 2rem;
}
</style>
