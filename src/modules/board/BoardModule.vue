<script lang="ts">
import { provide } from 'vue';
import HomeFooter from '../../components/blocks/HomeFooter.vue';
import HomeHeader from '../../components/blocks/HomeHeader.vue';
import HomeMain from '../../components/blocks/HomeMain.vue';
import { BoardService } from './services/BoardService';
import { SocketService } from './services/SocketService';
import { Storage } from './services/Storage';

export default {
  components: {
    HomeHeader,
    HomeMain,
    HomeFooter,
  },
  setup() {
    const socket = new SocketService('http://localhost:5441');
    const boardService = new BoardService(socket);
    const storage = new Storage();
    provide('boardService', boardService);
    provide('storage', storage);
    return { boardService };
  },
};
</script>

<template>
  <div class="container">
    <HomeHeader class="header" />
    <HomeMain class="main" />
    <HomeFooter class="footer" />
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
.main {
  flex-grow: 1;
  padding: 0;
  display: flex;
  align-items: stretch;
}
</style>
