<script lang="ts">
import { PropType } from 'vue';
import { IScratch } from '../../../../plugins/drawer';
import ScratchItem from './ScratchItem.vue';

export default {
  components: { ScratchItem },
  props: {
    scratches: {
      type: Array as PropType<IScratch[]>,
      default: () => [],
    },
  },
};
</script>

<template>
  <label>Scratches</label>
  <div class="container">
    <ScratchItem
      v-for="scratch in scratches"
      :key="scratch.id"
      :scratch="scratch"
    />
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  row-gap: 5px;
}
</style>

