import Vue from 'vue';
import { INoteBook, INoteBookState } from '@/types';

export const setWorkBooks = (state: INoteBookState, payload: INoteBook[]) => {
  Vue.set(state, 'workBooks', JSON.parse(JSON.stringify(payload)));
};

export const addWorkBook = (state: INoteBookState, payload: INoteBook) => {
  Vue.set(state, 'workBooks', [payload, ...state.noteBooks]);
};

export const setWorkBook = (state: INoteBookState, payload: INoteBook) => {
  Vue.set(state, 'workBook', {...payload});
};

