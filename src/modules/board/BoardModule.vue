<script lang="ts">
import { provide } from 'vue';
import HomeFooter from '../../components/HomeFooter.vue';
import HomeHeader from '../../components/HomeHeader.vue';
import HomeMain from '../../components/HomeMain.vue';
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
    const socket = new SocketService(process.env.NODE_ENV === 'development'?'http://localhost:3000':'http://drawo.ru/');
    const boardService$ = new BoardService(socket);
    provide('boardService', boardService$);
    provide('storage', new Storage());
    return { boardService$ };
  },
  beforeUnmount() {
    this.boardService$.disconnect();
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
