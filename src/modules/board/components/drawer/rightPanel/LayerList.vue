<script lang="ts">
import IconButton from '@ui/buttons/IconButton.vue';
import { PropType } from 'vue';
import LayerItem from './LayerItem.vue';
import PanelSection from './PanelSection.vue';

export default {
  components: { LayerItem, IconButton, PanelSection },
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
  <PanelSection>
    <template #header>
      <label>Layers</label>
      <IconButton class="add-btn" @click.stop="$emit('createLayer')"
        >+</IconButton
      >
    </template>
    <ul class="container">
      <LayerItem
        v-for="(layer, idx) in layers"
        :key="layer.id"
        :layer="layer"
        :index="idx"
        @delete-layer="$emit('delete-layer', $event)"
        @select-layer="$emit('selectLayer', $event)"
      />
    </ul>
  </PanelSection>
</template>

<style scoped>
header label {
  cursor: pointer;
  flex-grow: 1;
}

header .add-btn {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
}

.container {
  height: calc(100% - 30px);
  overflow-y: auto;
  padding: 5px 0 0 5px;
  display: flex;
  flex-direction: column;
  row-gap: 4px;
}
</style>
