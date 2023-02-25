<script lang="ts">
import IconButton from '@ui/buttons/IconButton.vue';
import ExitIcon from '@assets/svg/exit.svg?component';

export default {
  components: { ExitIcon, IconButton },
};
</script>

<template>
  <IconButton blank class="exit-btn"><ExitIcon /></IconButton>
</template>

<style scoped>
.exit-btn {
  margin-right: 10px;
}
.exit-btn svg {
  width: 2.8rem;
  height: 2.8rem;
}
</style>
