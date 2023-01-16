<script lang="ts">
import { Teleport } from 'vue';
import CloseButton from './ui/buttons/CloseButton.vue';

export default {
  components: { Teleport: Teleport as any, CloseButton },
  props: {
    title: { type: String, default: '' },
    isOpen: Boolean,
    small: Boolean,
    skipOutsideClick: Boolean,
  },
  emits: ['close'],
  data: function data() {
    return {};
  },
};
</script>

<template>
  <Teleport v-if="isOpen" to="body">
    <div class="modal-backdrop">
      <div
        v-click-outside="() => (!skipOutsideClick ? $emit('close') : {})"
        :class="{ modal: true, small }"
      >
        <slot class="header" name="header">
          <h2>{{ title || 'form' }}</h2>
          <CloseButton
            class="close"
            @click.prevent.left="() => $emit('close')"
          />
        </slot>
        <slot></slot>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.modal-backdrop {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  background: #88888860;
}
.modal {
  border-radius: 10px;
  min-width: 340px;
  min-height: 320px;
  max-width: 100vw;
  max-height: 100vh;
  padding: 16px 22px;
  position: absolute;
  top: 50%;
  left: 50%;
  background: var(--c-default-background);
  transform: translate(-50%, -50%);
  box-shadow: -2px 2px 6px 3px var(--c-default-shadow);
}
.modal.small {
  min-height: 50px;
  width: 320px;
}
h2 {
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-right: 28px;
  min-height: 2.2rem;
  font-size: 2.2rem;
  line-height: 2.6rem;
  margin-bottom: 16px;
}
.close {
  position: absolute;
  right: 21px;
  top: 21px;
}
</style>
