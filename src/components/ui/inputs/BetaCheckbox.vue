<script lang="ts">
import InputWrapper, { wrapperProps } from './InputWrapper.vue';

export default {
  components: { InputWrapper },
  props: {
    ...wrapperProps,
    modelValue: { type: Boolean, default: false },
    placeholder: { type: String, default: '' },
  },
  emits: ['update:modelValue'],
};
</script>

<template>
  <InputWrapper v-bind="{ compact, reverse, id, label, error }">
    <input
      :id="id"
      :placeholder="placeholder"
      :checked="modelValue"
      type="checkbox"
      @input="
        $emit('update:modelValue', ($event.target as HTMLInputElement)?.checked)
      "
    />
  </InputWrapper>
</template>

<style scoped>
input {
  border: 0;
  appearance: none;
  outline: none;
  border-radius: 0;
  width: 20px;
  height: 20px;
  margin: 0;
}
input:checked {
  margin: 1px;
  width: 18px;
  height: 18px;
  position: relative;
  background: green;
  border-radius: 2px;
}

input:checked::after {
  content: '';
  display: block;
  position: absolute;
  width: 30%;
  height: 60%;
  border-right: 2px solid #fff;
  border-bottom: 2px solid #fff;
  left: 52%;
  top: 40%;
  transform: translate(-50%, -50%) rotate(45deg);
}
</style>
