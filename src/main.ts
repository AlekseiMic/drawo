import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import * as VueRouter from 'vue-router';
import { routes } from './routes/index';
import { VueModule } from './VueModule';
import BoardModule from './modules/board';

const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes,
});

function registerModule(module: VueModule) {
  if (module.route) router.addRoute(module.route);
}

registerModule(BoardModule);

const app = createApp(App);
app.directive('click-outside', {
  beforeMount: function (el, binding) {
    el.clickOutsideListener = (event: MouseEvent) => {
      if (el !== event.target && !el.contains(event.target)) {
        binding.value();
      }
    };
    document.addEventListener('click', el.clickOutsideListener);
  },
  unmounted: function (el) {
    document.removeEventListener('click', el.clickOutsideListener);
  },
});
app.use(router);
app.mount('#app');
