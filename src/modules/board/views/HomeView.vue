<script lang="ts">
import SimpleModal from '../../../components/SimpleModal.vue';
import PsiInput from '@ui/inputs/PsiInput.vue';
import { useVuelidate } from '@vuelidate/core';
import { minLength, required, requiredIf } from '@vuelidate/validators';
import AlphaButton from '@ui/buttons/AlphaButton.vue';
import BetaCheckbox from '@ui/inputs/BetaCheckbox.vue';

export default {
  components: {
    SimpleModal,
    PsiInput,
    AlphaButton,
    BetaCheckbox,
  },
  setup: () => ({ v$: useVuelidate({}) }),
  data: function () {
    return {
      form: {
        username: 'Vasya',
        room: '',
        create: true,
      },
    };
  },
  methods: {
    handleClose: function () {
      console.log('close');
      this.$router.push({ path: '/' });
    },
    handleSubmit() {
      const isInvalid = this.v$.$invalid;
      console.log(isInvalid);
      if (isInvalid) return;
    },
  },
  validations() {
    return {
      form: {
        username: { required, minLength: minLength(10) },
        room: {
          requiredIf: requiredIf(() => !this.form.create),
          minLength: minLength(10),
        },
        create: {},
      },
    };
  },
};
</script>

<template>
  <SimpleModal
    small
    skip-outside-click
    is-open
    :title="form.create ? 'Create room' : 'Connect to the room'"
    @close="handleClose"
  >
    <form @submit.prevent="handleSubmit">
      <PsiInput
        id="username"
        v-model="v$.form.username.$model"
        label="Username"
        :error="v$.form.username.$errors[0]?.$message"
      />
      <BetaCheckbox
        id="create"
        v-model="v$.form.create.$model"
        label="Create"
        compact
        reverse
      />
      <PsiInput
        id="room"
        v-model="v$.form.room.$model"
        label="Room"
        :disabled="form.create"
        :error="v$.form.room.$errors[0]?.$message"
      />
      <AlphaButton class="submit" full type="submit">{{
        form.create ? 'Create' : 'Connect'
      }}</AlphaButton>
    </form>
  </SimpleModal>
</template>

<style scoped lang="scss">
form {
  padding: 15px 0 30px 0;
}
.submit {
  margin-top: 15px;
}
</style>
