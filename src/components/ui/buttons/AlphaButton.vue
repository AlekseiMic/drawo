<script lang="ts">
export default {
  props: {
    full: Boolean,
    blank: Boolean,
  },
};
</script>

<template>
  <button :class="{ full, blank }">
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
  &.blank {
    background: transparent;
    border: 0;
  }
  &:hover {
    opacity: .6;
  }
  &:focus {
    outline: 2px solid purple;
  }
}
</style>
