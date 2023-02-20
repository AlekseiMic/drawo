<script lang="ts">
import OmegaLink from '../ui/OmegaLink.vue';
export default {
  components: { OmegaLink },
};
</script>

<template>
  <header @mousedown.stop="" @touchstart.stop="" @touchend.stop="">
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
  z-index: 1000;
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
