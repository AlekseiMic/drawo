<script lang="ts">
import { PropType } from 'vue';
import { Layer } from '../../../../plugins/drawer';

export default {
  props: {
    layers: {
      type: Array as PropType<Layer[]>,
      default: () => [],
    },
  },
};
</script>

<template>
  <div>
    <div v-for="layer in layers" :key="layer.id">
      <div v-if="layer.id !== 'preview'">{{ layer.id }}</div>
    </div>
  </div>
</template>

<style></style>
