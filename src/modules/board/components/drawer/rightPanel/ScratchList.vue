<script lang="ts">
import { PropType } from 'vue';
import PanelSection from './PanelSection.vue';
import ScratchItem from './ScratchItem.vue';

export default {
  components: { ScratchItem, PanelSection },
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
  <PanelSection>
    <template #header>
      <label>Scratches</label>
    </template>
    <ul class="container">
      <ScratchItem
        v-for="scratch in scratches"
        :key="scratch"
        :scratch="scratch"
        @delete-scratch="$emit('delete-scratch', $event)"
      />
    </ul>
  </PanelSection>
</template>

<style scoped>
.container {
  height: calc(100% - 30px);
  overflow-y: auto;
  padding: 5px 0 0 5px;
  display: flex;
  flex-direction: column;
  row-gap: 4px;
}
</style>
