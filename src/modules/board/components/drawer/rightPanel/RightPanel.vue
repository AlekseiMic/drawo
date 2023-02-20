<script lang="ts">
import LayerList from './LayerList.vue';
import ScratchList from './ScratchList.vue';
import { PropType } from 'vue';
import SettingsList from './SettingsList.vue';
import { Manager } from '@plugins/drawer/';

export default {
  components: {
    LayerList,
    ScratchList,
    SettingsList,
  },
  props: {
    board: {
      type: Object as PropType<Manager>,
      required: true,
    },
  },
};
</script>

<template>
  <div class="panel" @touchstart.stop="" @touchend.stop="" @click.stop="" @mousedown.stop="" @mouseup.stop="">
    <SettingsList :board="board" />
    <LayerList :board="board" />
    <ScratchList :board="board" />
  </div>
</template>

<style scoped>
.settings {
  flex: 1;
}
.panel {
  overflow-y: auto;
  height: calc(100vh - 50px);
}
.panel > * {
  max-height: 33%;
  height: 100%;
}
</style>
