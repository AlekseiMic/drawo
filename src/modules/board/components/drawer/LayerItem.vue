<script lang="ts">
import { Layer } from 'src/plugins/drawer';
import { PropType } from 'vue';

export default {
  props: {
    layer: Object as PropType<Layer>,
    index: Number,
  },
  emits: ['delete-layer'],
};
</script>

<template>
  <div class="layer">
    <div class="miniature" />
    <div class="name">Layer #{{ index }}</div>
    <button v-if="layer && layer.id" @click="$emit('delete-layer', layer!.id)">
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
