import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersist from 'vuex-persist';
import base from './base';
import user from './user';
import workBook from './workbook';
import noteBook from './noteBook';

/* const vuexPersist = new VuexPersist({
  key: 'workalongo-extension',
  storage: window.localStorage,
  modules: ['base'],
}); */

Vue.use(Vuex);

export default new Vuex.Store({
  // plugins: [vuexPersist.plugin],
  modules: {
    base,
    user,
    workBook,
    noteBook,
  },

  // enable strict mode (adds overhead!)
  // for dev mode only
  strict: process.env.DEV === 'true',
});
