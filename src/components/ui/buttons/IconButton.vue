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
  width: 40px;
  height: 40px;
  border-radius: 40px;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    font-size: 2.2rem;
    max-width: 30px;
    max-height: 30px;
  }
}
</style>
