<script lang="ts">
import IconButton from '@ui/buttons/IconButton.vue';
import { User } from 'src/plugins/drawer';
import { PropType } from 'vue';

export default {
  components: { IconButton },
  props: {
    observers: {
      type: Array as PropType<User[]>,
      default: () => [],
    },
    active: {
      type: String as PropType<string | null>,
      default: () => null,
    },
  },
  emits: ['changeObserver'],
};
</script>

<template>
  <div class="observerPanel">
    <IconButton
      v-for="observer in observers"
      :key="observer.id"
      :title="observer.name"
      :class="{
        observer: true,
        active: active === observer.id,
      }"
      @click="$emit('changeObserver', observer)"
    >
      <span :title="observer.id">
        {{ observer.name.slice(0, 2).toUpperCase() }}
      </span>
    </IconButton>
  </div>
</template>

<style scoped lang="scss">
.observerPanel {
  display: flex;
  column-gap: 10px;
}
.observer {
  cursor: pointer;
  & span {
    display: block;
    overflow: hidden;
  }
  &.active {
    box-shadow: inset 0 0 4px 2px cyan;
    background: red;
  }
}
</style>
