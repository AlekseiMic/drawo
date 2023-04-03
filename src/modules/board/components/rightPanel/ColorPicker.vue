<script lang="ts">
export default {
  props: {
    active: String,
  },
  emits: ['changeColor'],
  data() {
    return {
      colors: ['#F5F5F5ff', '#FC2947ff', '#FF6000ff', '#89375Fff', '#B2A4FFff', '#19A7CEff','#FCE22Aff', '#AACB73ff', '#820000ff', '#0002A1ff'],
    };
  },
  methods: {
    changeColor(color: string) {
      this.$emit('changeColor', color);
    },
  },
};
</script>

<template>
  <div>
    <div>Color:</div>
    <div class="container">
      <button
        v-for="color in colors"
        :key="color"
        :style="{ backgroundColor: color }"
        :class="{ color: true, active: active === color }"
        @click="changeColor(color)"
      />
    </div>
  </div>
</template>

<style scoped>
.container {
  padding: 5px 0;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
}
.color {
  border-radius: 3px;
  box-shadow: 0 0 3px 1px #777;
  width: 25px;
  height: 25px;
  cursor: pointer;
}
.color.active {
  box-shadow: 0 0 1px 3px #00aa44
}
</style>

