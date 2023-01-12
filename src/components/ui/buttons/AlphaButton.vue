<script lang="ts">
export default {
  props: {
    full: Boolean,
  },
};
</script>

<template>
  <button :class="{ full }">
    <slot></slot>
  </button>
</template>

<style scoped lang="scss">
button {
  cursor: pointer;
  border: 0;
  padding: 5px;
  border-radius: 5px;
  height: 32px;
  font-size: 1.6rem;
  &.full {
    width: 100%;
  }
}
</style>
