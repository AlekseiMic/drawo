<script lang="ts">
import { PropType } from 'vue';
import { IScratch } from '../../../../plugins/drawer';

export default {
  props: {
    scratches: {
      type: Array as PropType<IScratch[]>,
      default: () => [],
    },
  },
};
</script>

<template>
  <div>
    <div v-for="scratch in scratches" :key="scratch.id">{{ scratch.id }}</div>
  </div>
</template>

<style></style>
