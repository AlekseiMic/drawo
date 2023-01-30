<script lang="ts">
import ColorPicker from './ColorPicker.vue';
import LineWidthPicker from './LineWidthPicker.vue';
import LayerList from './LayerList.vue';
import ScratchList from './ScratchList.vue';
import { PropType } from 'vue';
import { Layer } from '../../../../plugins/drawer';

export default {
  components: { ColorPicker, LineWidthPicker, LayerList, ScratchList },
  props: {
    lineWidth: { type: Number, required: true },
    color: { type: String, required: true },
    layers: { type: Array as PropType<Layer[]>, default: () => [] },
    scratches: { type: Array as PropType<string[]>, default: () => [] },
  },
  emits: ['changeWidth', 'changeColor', 'delete-scratch', 'delete-layer'],
  renderTriggered() {
    console.log('render');
  },
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
  <div @click.stop="" @mousedown.stop="" @mouseup.stop="">
    <LineWidthPicker :default-value="lineWidth" @change-width="changeWidth" />
    <ColorPicker :active="color" @change-color="changeColor" />
    <LayerList :layers="layers" @delete-layer="$emit('delete-layer', $event)" />
    <ScratchList
      :scratches="scratches"
      @delete-scratch="$emit('delete-scratch', $event)"
    />
  </div>
</template>

<style></style>
