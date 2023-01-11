import HomeView from './../views/HomeView.vue';
import VueRouter from 'vue-router';
import HomeLayout from '../layouts/HomeLayout.vue';
import NotFound from '../views/NotFound.vue';

export const routes: VueRouter.RouteRecordRaw[] = [
  {
    path: '/',
    component: HomeLayout,
    children: [
      { path: '', component: HomeView },
      { path: '/:pathMatch(.*)*', component: NotFound },
    ],
  },
];
