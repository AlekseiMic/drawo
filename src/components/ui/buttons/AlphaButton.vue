<script lang="ts">
export default {};
</script>

<template>
  <button>
    <slot></slot>
  </button>
</template>

<style scoped>
button {
  cursor: pointer;
  border: 0;
  padding: 5px;
  border-radius: 5px;
}
</style>

