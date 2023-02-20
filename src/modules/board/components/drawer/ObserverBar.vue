<script lang="ts">
import { Manager, User } from '@plugins/drawer';
import IconButton from '@ui/buttons/IconButton.vue';
import { PropType } from 'vue';

export default {
  components: { IconButton },
  props: {
    board: {
      type: Object as PropType<Manager>,
      required: true,
    },
  },
  methods: {
    setObserver(observer: User) {
      this.board.users?.setActive(observer.id);
    },
  },
};
</script>

<template>
  <div class="observerPanel">
    <IconButton
      v-for="observer in board.users.users"
      :key="observer.id"
      :title="observer.name"
      :class="{
        observer: true,
        active: board.users.active === observer.id,
      }"
      @click="setObserver(observer)"
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
