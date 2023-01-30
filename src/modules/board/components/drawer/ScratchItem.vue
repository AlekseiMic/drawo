<script lang="ts">
export default {
  props: {
    scratch: {
      type: String,
      required: true,
    },
  },
  emits: ['deleteScratch'],
};
</script>

<template>
  <div class="scratch">
    <div class="miniature"></div>
    <span class="name">Scratch</span>
    <button @click="$emit('deleteScratch', scratch)">Delete</button>
  </div>
</template>

<style scoped>
.scratch {
  height: 34px;
  background: #111;
  padding: 2px 2px;
  display: flex;
  align-items: center;
  column-gap: 10px;
}
.miniature {
  background: #888;
  width: 32px;
  height: 32px;
}
</style>
