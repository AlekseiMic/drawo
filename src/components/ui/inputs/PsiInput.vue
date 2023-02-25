<script lang="ts">
import { PropType } from 'vue';
import InputWrapper, { wrapperProps } from './InputWrapper.vue';

export default {
  components: { InputWrapper },
  props: {
    ...wrapperProps,
    modelValue: { type: [String, Number], default: '' },
    placeholder: { type: String, default: '' },
    type: { type: String as PropType<'text' | 'number'>, default: 'text' },
  },
  emits: ['update:modelValue'],
};
</script>

<template>
  <InputWrapper full v-bind="{ id, label, error, disabled }">
    <input
      :id="id"
      :placeholder="placeholder"
      :value="modelValue"
      :type="type"
      @input="
        $emit('update:modelValue', ($event.target as HTMLInputElement)?.value)
      "
    />
  </InputWrapper>
</template>

<style scoped lang="scss">
input {
  border: none;
  outline: none;
  appearance: none;
  background: transparent;
  padding: 0 10px;
  width: 100%;
  height: 30px;
  font-size: inherit;
  color: var(--c-default-text-120);

  &::placeholder {
    color: var(--c-default-text-60);
  }
}
</style>
