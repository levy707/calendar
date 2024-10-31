import { clickOutside } from '@/directives/clickOutside.js';
import Vue from 'vue';
import App from './App.vue';
import '@/assets/style/styles.scss';
import '@/assets/fonts/icons-font/icons.css';

Vue.directive('clickOutside', clickOutside);
Vue.config.productionTip = false;

new Vue({
    render: h => h(App),
}).$mount('#app');
