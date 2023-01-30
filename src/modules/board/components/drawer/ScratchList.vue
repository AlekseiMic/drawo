<script lang="ts">
import { PropType } from 'vue';
import ScratchItem from './ScratchItem.vue';

export default {
  components: { ScratchItem },
  props: {
    scratches: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
  },
  emits: ['delete-scratch'],
};
</script>

<template>
  <label>Scratches</label>
  <div class="container">
    <ScratchItem
      v-for="scratch in scratches"
      :key="scratch"
      :scratch="scratch"
      @delete-scratch="$emit('delete-scratch', $event)"
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
