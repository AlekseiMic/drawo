<script lang="ts">
export default {
  props: {
    defaultValue: {
      type: Number,
      default: () => 1,
    },
  },
  emits: ['changeWidth'],
  data() {
    return {
      value: this.defaultValue,
    };
  },
  methods: {
    changeWidth(event: Event) {
      if (event.target instanceof HTMLInputElement) {
        this.value = Number(event.target?.value ?? 1);
        this.$emit('changeWidth', this.value);
      }
    },
  },
};
</script>

<template>
  <label
    >Line thickness: {{ value }}
    <input
      type="range"
      :step="1"
      :min="1"
      :max="5"
      :value="value"
      @input="changeWidth"
    />
  </label>
</template>

<style></style>

