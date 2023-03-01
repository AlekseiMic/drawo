<script lang="ts">
import AppList from '../components/module-list/AppList.vue';
import BoardSvg from '@assets/svg/board.svg?component';

export default {
  components: { AppList },
  data: function () {
    return {
      apps: [
        {
          name: 'board',
          description: 'draw simple art with your friends',
          image: BoardSvg,
          multiplayer: true,
          url: '/board',
        },
      ],
    };
  },
};
</script>

<template>
  <h2>choose application</h2>
  <AppList :apps="apps" />
</template>

<style scoped>
h2 {
  text-align: center;
  font-size: 3rem;
  margin-bottom: 40px;
}
</style>
