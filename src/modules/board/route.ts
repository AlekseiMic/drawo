import VueRouter from 'vue-router';
import HomeView from './views/HomeView.vue';

export const route: VueRouter.RouteRecordRaw = {
  path: '/board/',
  component: () => import('./BoardModule.vue'),
  children: [
    {
      path: '',
      component: HomeView,
    },
    {
      name: 'boardRoom',
      path: ':id',
      component: () => import('./views/BoardView.vue'),
    },
  ],
};
