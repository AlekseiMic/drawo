<script lang="ts">
import ColorPicker from './ColorPicker.vue';
import LineWidthPicker from './LineWidthPicker.vue';
import LayerList from './LayerList.vue';
import ScratchList from './ScratchList.vue';
import { PropType } from 'vue';
import { Layer, IScratch } from '../../../../plugins/drawer';

export default {
  components: { ColorPicker, LineWidthPicker, LayerList, ScratchList },
  props: {
    lineWidth: Number,
    color: String,
    layers: {
      type: Array as PropType<Layer[]>,
      default: () => [],
    },
    scratches: {
      type: Array as PropType<IScratch[]>,
      default: () => [],
    },
  },
  emits: ['changeWidth'],
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
  <div>
    <LineWidthPicker :default-value="lineWidth" @change-width="changeWidth" />
    <ColorPicker :active="color" @change-color="changeColor" />
    <LayerList :layers="layers" />
    <ScratchList :scratches="scratches" />
  </div>
</template>

<style></style>
