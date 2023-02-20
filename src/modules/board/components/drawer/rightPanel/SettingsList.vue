<script lang="ts">
import { Manager } from '@plugins/drawer';
import { PropType } from 'vue';
import ColorPicker from './ColorPicker.vue';
import LineWidthPicker from './LineWidthPicker.vue';
import PanelSection from './PanelSection.vue';

export default {
  components: {
    ColorPicker,
    LineWidthPicker,
    PanelSection,
  },
  props: {
    board: {
      type: Object as PropType<Manager>,
      required: true,
    },
  },
  methods: {
    changeWidth(width: number) {
      this.board?.settings.set('thickness', width);
    },
    changeColor(color: string) {
      this.board?.settings.set('color', color);
    },
  },
};
</script>

<template>
  <PanelSection>
    <template #header>Settings</template>
    <div class="content">
      <LineWidthPicker
        :default-value="board.settings.get('thickness')"
        @change-width="changeWidth"
      />
      <ColorPicker
        :active="board.settings.get('color')"
        @change-color="changeColor"
      />
    </div>
  </PanelSection>
</template>

<style scoped>
.content {
  padding: 10px;
}
</style>
