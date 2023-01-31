<script lang="ts">
import { PropType } from 'vue';
import LayerItem from './LayerItem.vue';

export default {
  components: { LayerItem },
  props: {
    layers: {
      type: Array as PropType<{ id: string; removable: boolean }[]>,
      required: true,
    },
  },
  emits: ['delete-layer', 'createLayer', 'selectLayer'],
};
</script>

<template>
  <div>
    <label>Layers</label><button @click="$emit('createLayer')">add</button>
  </div>
  <div class="container">
    <LayerItem
      v-for="(layer, idx) in layers"
      :key="layer.id"
      :layer="layer"
      :index="idx"
      @delete-layer="$emit('delete-layer', $event)"
      @select-layer="$emit('selectLayer', $event)"
    />
  </div>
</template>

<style scoped>
.container {
  margin-top: 5px;
  display: flex;
  flex-direction: column;
  row-gap: 2px;
}
</style>
