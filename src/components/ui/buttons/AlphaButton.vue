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
  background: var(--c-default-background-60);
  color: var(--c-default-text);

  &.full {
    width: 100%;
  }

  &.blank {
    background: transparent;
    border: 0;
  }

  &:hover {
    opacity: 0.6;
  }

  &:focus {
    outline: 2px solid purple;
  }
}
</style>
