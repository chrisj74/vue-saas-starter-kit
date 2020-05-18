import Vue from 'vue';
import { INoteBook, INoteBookState } from '@/types';

export const setNoteBooks = (state: INoteBookState, payload: INoteBook[]) => {
  Vue.set(state, 'noteBooks', JSON.parse(JSON.stringify(payload)));
};

export const addNoteBook = (state: INoteBookState, payload: INoteBook) => {
  Vue.set(state, 'noteBooks', [payload, ...state.noteBooks]);
};

export const setNoteBook = (state: INoteBookState, payload: INoteBook) => {
  Vue.set(state, 'noteBook', {...payload});
};

export const setSettings = (state: INoteBookState, payload: {[key: string]: any}) => {
  Vue.set(state, 'settings', {...state.settings, ...JSON.parse(JSON.stringify(payload))});
};
