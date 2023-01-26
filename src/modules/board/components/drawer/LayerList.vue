<script lang="ts">
import { PropType } from 'vue';
import { Layer } from '../../../../plugins/drawer';
import LayerItem from './LayerItem.vue';

export default {
  components: { LayerItem },
  props: {
    layers: {
      type: Array as PropType<Layer[]>,
      default: () => [],
    },
  },
};
</script>

<template>
  <label>Layers</label>
  <div class="container">
    <LayerItem
      v-for="(layer, idx) in layers"
      :key="layer.id"
      :layer="layer"
      :index="idx"
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
