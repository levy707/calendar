import Vue from 'vue';
import App from './App.vue';
import store from './store';
import '@/assets/style/styles.scss';
import '@/assets/fonts/icons-font/icons.css';
import { clickOutside } from '@/directives/clickOutside';
Vue.directive('clickOutside', clickOutside);
Vue.config.productionTip = false;

new Vue({
  store,
  render: (h) => h(App),
}).$mount('#app');
