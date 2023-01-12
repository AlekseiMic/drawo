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
  <InputWrapper blank v-bind="{ compact, reverse, id, label, error }">
    <div class="radio-group">
      <label v-for="option in options" :key="option.value">
        <input
          :value="option.value"
          :checked="option.value === modelValue"
          type="radio"
          @input="$emit('update:modelValue', option.value)"
        />
        {{ option.label }}
      </label>
    </div>
  </InputWrapper>
</template>

<style scoped>
label {
  display: block;
}
</style>
