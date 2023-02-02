<script lang="ts">
import LayerList from './LayerList.vue';
import ScratchList from './ScratchList.vue';
import { PropType } from 'vue';
import SettingsList from './SettingsList.vue';

export default {
  components: {
    LayerList,
    ScratchList,
    SettingsList,
  },
  props: {
    lineWidth: { type: Number, default: () => 3 },
    color: { type: String, default: () => '#ffffff' },
    layers: {
      type: Array as PropType<{ id: string; removable: boolean }[]>,
      default: () => [],
    },
    scratches: { type: Array as PropType<string[]>, default: () => [] },
  },
  emits: [
    'changeWidth',
    'changeColor',
    'delete-scratch',
    'delete-layer',
    'createLayer',
    'selectLayer',
  ],
  methods: {
    changeWidth(width: number) {
      this.$emit('changeWidth', width);
    },
    changeColor(color: string) {
      this.$emit('changeColor', color);
    },
  },
};
</script>

<template>
  <div class="panel" @click.stop="" @mousedown.stop="" @mouseup.stop="">
    <SettingsList
      :line-width="lineWidth"
      :color="color"
      @change-width="changeWidth"
      @change-color="changeColor"
    />
    <LayerList
      :layers="layers"
      @delete-layer="$emit('delete-layer', $event)"
      @create-layer="$emit('createLayer')"
      @select-layer="$emit('selectLayer', $event)"
    />
    <ScratchList
      :scratches="scratches"
      @delete-scratch="$emit('delete-scratch', $event)"
    />
  </div>
</template>

<style scoped>
.settings {
  flex: 1;
}
.panel {
  overflow-y: auto;
  height: calc(100vh - 50px);
}
.panel > * {
  max-height: 33%;
  height: 100%;
}
</style>
