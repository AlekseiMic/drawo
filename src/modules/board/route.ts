import VueRouter from 'vue-router';
import HomeView from './views/HomeView.vue';
import BoardModule from './BoardModule.vue';
import BoardView from './views/BoardView.vue';

export const route: VueRouter.RouteRecordRaw = {
  path: '/board/',
  component: BoardModule,
  children: [
    {
      path: '',
      component: HomeView,
    },
    {
      name: 'boardRoom',
      path: ':id',
      component: BoardView,
    },
  ],
};
