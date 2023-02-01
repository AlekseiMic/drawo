<script lang="ts">
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
    lineWidth: { type: Number, required: true },
    color: { type: String, required: true },
  },
  emits: ['changeWidth', 'changeColor'],
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
  <PanelSection>
    <template #header>Settings</template>
    <div class="content">
      <LineWidthPicker :default-value="lineWidth" @change-width="changeWidth" />
      <ColorPicker :active="color" @change-color="changeColor" />
    </div>
  </PanelSection>
</template>

<style scoped>
.content {
  padding: 10px;
}
</style>
