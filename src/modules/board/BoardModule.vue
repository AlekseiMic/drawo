<script lang="ts">
import { provide } from 'vue';
import HomeFooter from '../../components/blocks/HomeFooter.vue';
import HomeHeader from '../../components/blocks/HomeHeader.vue';
import HomeMain from '../../components/blocks/HomeMain.vue';
import { BoardService } from './services/BoardService';
import { SocketService } from './services/SocketService';

export default {
  components: {
    HomeHeader,
    HomeMain,
    HomeFooter,
  },
  setup() {
    const socket = new SocketService('http://localhost:5441');
    const boardService = new BoardService(socket);
    provide('boardService', boardService);
    return { boardService };
  },
};
</script>

<template>
  <HomeHeader />
  <HomeMain />
  <HomeFooter />
</template>

<style>
nav {
  display: flex;
  flex-direction: row;
  column-gap: 10px;
}
</style>
