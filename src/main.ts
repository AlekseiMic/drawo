import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import * as VueRouter from 'vue-router';
import { routes } from './routes/index';
import { VueModule } from './VueModule';
import BoardModule from './modules/board';
import { clickOutside } from './directives/clickOutside';

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes,
});

function registerModule(module: VueModule) {
  if (module.route) router.addRoute(module.route);
}

registerModule(BoardModule);

const app = createApp(App);

app.directive('click-outside', clickOutside);
app.use(router);
app.mount('#app');
