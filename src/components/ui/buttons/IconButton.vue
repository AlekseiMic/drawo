<script lang="ts">
import AlphaButton from './AlphaButton.vue';

export default { components: { AlphaButton } };
</script>

<template>
  <AlphaButton>
    <slot />
  </AlphaButton>
</template>

<style scoped lang="scss">
button {
  cursor: pointer;
  width: 4rem;
  height: 4rem;
  border-radius: 4rem;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    font-size: 2.2rem;
    max-width: 3rem;
    max-height: 3rem;
  }
}
</style>
