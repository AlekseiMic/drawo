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
  <label>
    <span>Line thickness</span>
    <div class="range">
      <input
        type="range"
        :step="1"
        :min="1"
        :max="5"
        :value="value"
        @input="changeWidth"
      />
      <span class="value">{{ value }}</span>
    </div>
  </label>
</template>

<style scoped>
.range {
  display: flex;
  align-items: center;
  padding-right: 0px;
}
.range input {
  width: 100%;
}
.value {
  flex-shrink: 0;
  display: block;
  margin-left: 10px;
  width: 30px;
  background: #222;
  box-shadow: inset 0px 0px 0px 1px #000;
  font-weight: bold;
  line-height: 30px;
  text-align: center;
  height: 30px;
}
</style>
