<script lang="ts">
import { PropType } from 'vue';
import InputWrapper, { wrapperProps } from './InputWrapper.vue';

export default {
  components: { InputWrapper },
  props: {
    ...wrapperProps,
    modelValue: {
      type: [Number, String],
      default: null,
    },
    placeholder: { type: String, default: '' },
    options: {
      type: Array as PropType<{ label: string; value: string }[]>,
      required: true,
    },
  },
  emits: ['update:modelValue'],
};
</script>

<template>
  <InputWrapper full v-bind="{ compact, reverse, id, label, error }">
    <select
      :id="id"
      :value="modelValue"
      @input="
        $emit('update:modelValue', ($event.target as HTMLInputElement)?.value)
      "
    >
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
  </InputWrapper>
</template>

<style scoped lang="scss">
select {
  background: transparent;
  height: 30px;
  width: 100%;
  padding: 0 10px;
}
</style>
