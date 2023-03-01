import VueRouter from 'vue-router';
import HomeLayout from '../layouts/HomeLayout.vue';
import NotFound from '../views/NotFound.vue';

export const routes: VueRouter.RouteRecordRaw[] = [
  {
    path: '/',
    component: HomeLayout,
    children: [
      { path: '', component: () => import('../views/HomeView.vue') },
      { path: '/:pathMatch(.*)*', component: NotFound },
    ],
  },
];
