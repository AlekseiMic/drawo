<script lang="ts">
import PsiInput from '@ui/inputs/PsiInput.vue';
import AlphaButton from '@ui/buttons/AlphaButton.vue';
import BetaCheckbox from '@ui/inputs/BetaCheckbox.vue';
import { ServerErrors, useVuelidate } from '@vuelidate/core';
import { minLength, required, requiredIf } from '@vuelidate/validators';
import { PropType, ref } from 'vue';

const defaultValues = () => ({
  username: '',
  room: '',
  create: true,
});

const defaultErrors = () => ({
  username: '',
  room: '',
  general: '',
});

export default {
  components: {
    PsiInput,
    AlphaButton,
    BetaCheckbox,
  },
  props: {
    defaultValues: {
      default: defaultValues,
      type: Object as PropType<ReturnType<typeof defaultValues>>,
    },
    errors: {
      default: defaultErrors,
      type: Object as PropType<ReturnType<typeof defaultErrors>>,
    },
  },
  emits: ['submit'],
  setup: () => {
    const externalResults = ref<ServerErrors>({});

    return {
      externalResults,
      v$: useVuelidate({ $externalResults: externalResults }),
    };
  },
  data() {
    return {
      username: '',
      room: '',
      create: true,
    };
  },
  watch: {
    errors(next: ReturnType<typeof defaultErrors>) {
      Object.entries(next).forEach(([name, error]) => {
        if (!['username', 'room'].includes(name) || !error) return;
        this.externalResults[name] = [error];
      });
    },
    create() {
      this.externalResults = {};
    },
  },
  beforeMount() {
    if (this.defaultValues) Object.assign(this.$data, this.defaultValues);
  },
  methods: {
    handleSubmit() {
      if (!this.v$.$validate() || this.v$.$invalid) return;
      this.$emit('submit', this.$data);
    },
  },
  validations() {
    return {
      username: { required, minLength: minLength(5) },
      room: {
        requiredIf: requiredIf(() => !this.create),
        minLength: minLength(10),
      },
      create: {},
    };
  },
};
</script>

<template>
  <form @submit.prevent="handleSubmit">
    <PsiInput
      id="username"
      v-model="v$.username.$model"
      label="username"
      :error="v$.username.$errors[0]?.$message"
    />
    <PsiInput
      id="room"
      v-model="v$.room.$model"
      label="room"
      :error="v$.room.$errors[0]?.$message"
    />
    <BetaCheckbox
      id="create"
      v-model="v$.create.$model"
      label="create"
      compact
      reverse
    />
    <AlphaButton :disabled="v$.$invalid" class="submit" full type="submit">{{
      create ? 'create' : 'connect'
    }}</AlphaButton>
  </form>
</template>

<style scoped lang="scss">
form {
  padding: 15px 0 30px 0;
}
.submit {
  margin-top: 10px;
}
</style>
