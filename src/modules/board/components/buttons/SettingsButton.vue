<script lang="ts">
import GearIcon from '@assets/svg/gear.svg?component';
import IconButton from '@ui/buttons/IconButton.vue';

export default {
  components: { GearIcon, IconButton },
};
</script>

<template>
  <IconButton class="settings-btn"><GearIcon /></IconButton>
</template>

<style scoped lang="scss">
.settings-btn svg {
  font-size: 3rem;
}
</style>

