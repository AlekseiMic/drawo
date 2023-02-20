<script lang="ts">
import IconButton from '@ui/buttons/IconButton.vue';
import { PropType } from 'vue';
import LayerItem from './LayerItem.vue';
import PanelSection from './PanelSection.vue';
import { Manager, createLayer, removeLayer } from '@plugins/drawer';
import { nanoid } from 'nanoid';

export default {
  components: { LayerItem, IconButton, PanelSection },
  props: {
    board: {
      type: Object as PropType<Manager>,
      required: true,
    },
  },
  computed: {
    layers() {
      const hiddenLayers = ['preview'];
      const lockedLayers = ['main'];
      return this.board.layers?.order.reduce(
        (acc: { id: string; removable: boolean }[], id) => {
          const layer = this.board.layers?.get(id);
          if (!layer || hiddenLayers.includes(id)) return acc;
          acc.push({
            id,
            removable: !lockedLayers.includes(id),
          });
          return acc;
        },
        []
      );
    },
  },
  methods: {
    deleteLayer(id: string) {
      this.board.actions.dispatch(removeLayer(id, {}));
    },
    createLayer() {
      const id = nanoid();
      const z = (this.board.layers?.getMaxZIndex() ?? 0) + 1;
      this.board.actions.dispatch(createLayer(id, z, {}));
      this.board.layers.setActive(id);
    },
    selectLayer(layerId: string) {
      this.board.layers?.setActive(layerId);
    },
  },
};
</script>

<template>
  <PanelSection>
    <template #header>
      <label>Layers</label>
      <IconButton class="add-btn" @click.stop="createLayer">+</IconButton>
    </template>
    <ul class="container">
      <LayerItem
        v-for="(layer, idx) in layers"
        :key="layer.id"
        :layer="layer"
        :index="idx"
        @delete-layer="deleteLayer"
        @select-layer="selectLayer"
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
