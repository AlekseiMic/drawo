<script lang="ts">
import PsiInput from '@ui/inputs/PsiInput.vue';
import AlphaButton from '@ui/buttons/AlphaButton.vue';
import { useVuelidate } from '@vuelidate/core';
import { minLength, required } from '@vuelidate/validators';

export default {
  components: {
    PsiInput,
    AlphaButton,
  },
  emits: ['submit'],
  setup: () => ({ v$: useVuelidate({}) }),
  data() {
    return {
      username: '',
    };
  },
  methods: {
    handleSubmit() {
      if (!this.v$.$validate()) return;
      this.$emit('submit', this.username);
    },
  },
  validations() {
    return {
      username: { required, minLength: minLength(5) },
    };
  },
};
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <PsiInput
      id="username"
      v-model="v$.username.$model"
      label=""
      placeholder="your name"
      :error="v$.username.$errors[0]?.$message?.toLowerCase()"
    />
    <AlphaButton class="submit" full type="submit">ok</AlphaButton>
  </form>
</template>

<style scoped>
form {
  padding: 0;
}
.submit {
  margin-top: 15px;
}
</style>
