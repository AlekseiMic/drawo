<script lang="ts">
import IconButton from '@ui/buttons/IconButton.vue';
import { Observer } from 'src/plugins/drawer';
import { PropType } from 'vue';

export default {
  components: { IconButton },
  props: {
    observers: {
      type: Array as PropType<Observer[]>,
      default: () => [],
    },
    users: {
      type: Object as PropType<Record<string, string>>,
      required: true,
    },
    active: {
      type: Object as PropType<null | Observer>,
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
      :title="users[observer.id]"
      :class="{
        observer: true,
        active: active === observer,
      }"
      @click="$emit('changeObserver', observer)"
    >
      <span>
        {{ users[observer.id] }}
      </span>
    </IconButton>
  </div>
</template>

<style scoped lang="scss">
.observer {
  cursor: pointer;
  &:hover {
    opacity: 0.8;
  }
  & span {
    display: block;
    max-width: 2ch;
    overflow: hidden;
  }
  &.active {
    box-shadow: inset 0 0 4px 2px cyan;
    background: red;
  }
}
</style>

