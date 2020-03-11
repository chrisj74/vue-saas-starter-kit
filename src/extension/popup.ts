import Vue from 'vue';
import App from '@/App.vue';
import router from '@/router/extension';
import store from '@/store';
import vuetify from '@/plugins/vuetify';
import { FirebaseAutoLogin, AUTH, fireApp } from '@/boot/firebase';
import { IExtensionPopupState } from '@/types';

Vue.config.productionTip = false;
Vue.prototype.$auth = AUTH;
Vue.prototype.$firebase = fireApp;

declare global {
  interface Window { chrome: any; }
}

window.chrome = window.chrome;

new Vue({
  router,
  store,
  vuetify,
  created() {
    FirebaseAutoLogin(this as Vue);

    /* Listen for window update */
    const vm = this;
    /* Listen for popup update */
    window.chrome.runtime.onMessage.addListener( function(response: any, sender: any, sendResponse: any) {
      if (response.type === 'setPopup') {
        const payload: IExtensionPopupState = {
          popupWindowId: response.popupWindowId,
          popupTabId: response.popupTabId,
        };
        vm.$store.dispatch('base/setExtension', payload);
      }
    });
  },
  render: (h) => h(App),
}).$mount('#app');
