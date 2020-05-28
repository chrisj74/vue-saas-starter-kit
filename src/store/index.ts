import Vue from 'vue';
import Vuex from 'vuex';
import VuexPersist from 'vuex-persist';
import base from './base';
import user from './user';
import workBook from './workbook';
import noteBook from './noteBook';
import firebase from 'firebase';

const vuexPersist = new VuexPersist({
  key: 'learnalongo-extension',
  storage: window.localStorage,
  modules: ['base', 'workBook', 'noteBook'],
});

let pluginsArray: any = [];
if (!firebase.auth().currentUser) {
  pluginsArray = [vuexPersist.plugin];
}

console.log('plugins=', pluginsArray);

Vue.use(Vuex);

export default new Vuex.Store({
  // plugins: pluginsArray,
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
