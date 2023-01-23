<script lang="ts">
import PsiInput from '@ui/inputs/PsiInput.vue';
import AlphaButton from '@ui/buttons/AlphaButton.vue';
import BetaCheckbox from '@ui/inputs/BetaCheckbox.vue';
import { useVuelidate } from '@vuelidate/core';
import { minLength, required, requiredIf } from '@vuelidate/validators';
import { PropType } from 'vue';

export default {
  components: {
    PsiInput,
    AlphaButton,
    BetaCheckbox,
  },
  props: {
    defaultValues: {
      default: () => ({
        username: '',
        room: '',
        create: true,
      }),
      type: Object as PropType<{
        username: string;
        room: string;
        create: boolean;
      }>,
    },
  },
  emits: ['submit'],
  setup: () => ({ v$: useVuelidate({}) }),
  data() {
    return {
      form: {
        username: '',
        room: '',
        create: true,
      },
    };
  },
  beforeMount() {
    if (this.defaultValues) this.form = { ...this.defaultValues };
  },
  methods: {
    handleSubmit() {
      if (!this.v$.$validate() || this.v$.$invalid) return;
      this.$emit('submit', this.form);
    },
  },
  validations() {
    return {
      form: {
        username: { required, minLength: minLength(5) },
        room: {
          requiredIf: requiredIf(() => !this.form.create),
          minLength: minLength(15),
        },
        create: {},
      },
    };
  },
};
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <PsiInput
      id="username"
      v-model="v$.form.username.$model"
      label="username"
      :error="v$.form.username.$errors[0]?.$message"
    />
    <BetaCheckbox
      id="create"
      v-model="v$.form.create.$model"
      label="create"
      compact
      reverse
    />
    <PsiInput
      id="room"
      v-model="v$.form.room.$model"
      label="room"
      :disabled="form.create"
      :error="v$.form.room.$errors[0]?.$message"
    />
    <AlphaButton class="submit" full type="submit">{{
      form.create ? 'create' : 'connect'
    }}</AlphaButton>
  </form>
</template>

<style scoped lang="scss">
form {
  padding: 15px 0 30px 0;
}
.submit {
  margin-top: 15px;
}
</style>
