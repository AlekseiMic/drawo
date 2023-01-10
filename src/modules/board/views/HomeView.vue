<script lang="ts">
import SimpleModal from '../../../components/SimpleModal.vue';

export default {
  components: { SimpleModal },
  data: function () {
    return { isOpen: true };
  },
  methods: {
    handleClose: function () {
      this.isOpen = false;
    },
  },
};
</script>

<template>
  <div>Board home view</div>
  <SimpleModal small :is-open="isOpen" :title="'title or longer lets test yes no what?'" @close="handleClose">
    Testo
  </SimpleModal>
</template>

<style></style>
