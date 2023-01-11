<script lang="ts">
import AppList from '../components/module-list/AppList.vue';

export default {
  components: { AppList },
  data: function () {
    return {
      apps: [
        {
          name: 'Board',
          description: 'Draw simple art with your friends',
          image: 'src/assets/svg/board.svg',
          multiplayer: true,
          url: '/board',
        },
      ],
    };
  },
};
</script>

<template>
  <h2>Choose application</h2>
  <AppList :apps="apps" />
</template>

<style scoped>
h2 {
  text-align: center;
  font-size: 3rem;
  margin-bottom: 40px;
}
</style>
