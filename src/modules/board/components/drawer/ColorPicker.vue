<script lang="ts">
export default {
  props: {
    active: String,
  },
  emits: ['changeColor'],
  data() {
    return {
      colors: ['#ffffffff', '#ff0000ff'],
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
  display: flex;
  gap: 10px;
}
.color {
  border-radius: 3px;
  box-shadow: 0 0 3px 1px #777;
  width: 25px;
  height: 25px;
}
.color.active {
  box-shadow: 0 0 3px 2px #00FF00
}
</style>

