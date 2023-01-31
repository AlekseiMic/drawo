<script lang="ts">
import { PropType } from 'vue';

export default {
  props: {
    layer: {
      type: Object as PropType<{ id: string; removable: boolean }>,
      required: true,
    },
    index: Number,
  },
  emits: ['delete-layer', 'selectLayer'],
};
</script>

<template>
  <div class="layer" @click="$emit('selectLayer', layer!.id)">
    <div class="miniature" />
    <div class="name">Layer {{ index }}</div>
    <button v-if="layer.removable" @click="$emit('delete-layer', layer!.id)">
      delete
    </button>
  </div>
</template>

<style scoped>
.layer {
  background: #202020;
  height: 40px;
  padding: 2px;
  display: flex;
  align-items: center;
  column-gap: 10px;
}
.layer .miniature {
  width: 36px;
  height: 36px;
  background: #888;
  border: 0;
  box-shadow: 0;
}
</style>
