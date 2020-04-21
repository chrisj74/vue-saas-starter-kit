import Vue from 'vue';
import { IWorkBook, IWorkBookState, IWorkBookPage, modesEnum, toolActionEnum, IWorkBookPageDimensions } from '@/types';

export const setWorkBooks = (state: IWorkBookState, payload: IWorkBook[]) => {
  Vue.set(state, 'workBooks', [...payload]);
};

export const addWorkBook = (state: IWorkBookState, payload: IWorkBook) => {
  Vue.set(state, 'workBooks', [payload, ...state.workBooks]);
};

export const setWorkBook = (state: IWorkBookState, payload: IWorkBook) => {
  Vue.set(state, 'workBook', {...payload});
};

export const setWorkBookData = (state: IWorkBookState, payload: Uint8Array) => {
  state.workBookData = payload;
};

export const setCurrentPage = (state: IWorkBookState, payload: string) => {
  state.currentPage = payload;
};

export const setCurrentPageByIndex = (state: IWorkBookState, payload: number) => {
  state.currentPage = state.workBook?.pages[payload].id;
};

export const setCurrentPageDimensions = (state: IWorkBookState, payload: IWorkBookPageDimensions) => {
  state.currentPageDimensions = {...state.currentPageDimensions, ...payload};
};

export const setWorkBookPages = (state: IWorkBookState, payload: IWorkBookPage[]) => {
  Vue.set(state, 'workBookPages', [...payload]);
};

export const setWorkBookPage = (state: IWorkBookState, payload: IWorkBookPage) => {
  Vue.set(state, 'workBookPage', {...payload});
};

export const setMode = (state: IWorkBookState, payload: modesEnum) => {
  state.modes.mode = payload;
};

export const setSubMode = (state: IWorkBookState, payload: modesEnum) => {
  state.modes.subMode = payload;
};

export const setSettings = (state: IWorkBookState, payload: {[key: string]: any}) => {
  Vue.set(state, 'workBookPage', {...state.settings, ...payload});
};

export const setToolAction = (state: IWorkBookState, payload: toolActionEnum) => {
  state.toolAction = payload;
};
