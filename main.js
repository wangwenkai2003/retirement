import Vue from 'vue';
import App from './App';
import store from '@/store/socket.js'; // 引入你的store文件

Vue.prototype.$store = store; // 将store绑定到Vue原型上，以便在所有组件中直接使用this.$store
global.globalData = {
  socketInstance: null,
};
new Vue({
  store,
  render: h => h(App)
}).$mount('#app');