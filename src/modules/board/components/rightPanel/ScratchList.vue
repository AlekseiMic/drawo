<script lang="ts">
import { PropType } from 'vue';
import PanelSection from './PanelSection.vue';
import ScratchItem from './ScratchItem.vue';
import { Manager, removeScratch } from '@plugins/drawer/';

export default {
  components: { ScratchItem, PanelSection },
  props: {
    board: {
      type: Object as PropType<Manager>,
      required: true,
    },
  },
  computed: {
    scratches() {
      const active = this.board.layers?.active;
      if (!active) return [];
      const scratchesIds = this.board.layers?.getScratches(active) ?? [];
      return scratchesIds.map((id) => this.board.scratches.get(id));
    },
  },
  methods: {
    deleteScratch(id: string) {
      if (this.board.layers?.active) {
        this.board?.actions.dispatch(
          removeScratch(id, {}, this.board.layers.active)
        );
      }
    },
  },
};
</script>

<template>
  <PanelSection>
    <template #header>
      <label>Scratches</label>
    </template>
    <ul class="container">
      <ScratchItem
        v-for="(scratch, index) in scratches"
        :key="scratch.id"
        :scratch="scratch"
        :index="scratches.length - index"
        @delete-scratch="deleteScratch"
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
