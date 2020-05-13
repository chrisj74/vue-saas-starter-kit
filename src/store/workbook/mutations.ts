import Vue from 'vue';
import { IWorkBook, IWorkBookState, IWorkBookPage, modesEnum,
  toolActionEnum, IWorkBookPageDimensions, subModesEnum, IUpdateWorkBookPage } from '@/types';

export const setWorkBooks = (state: IWorkBookState, payload: IWorkBook[]) => {
  Vue.set(state, 'workBooks', JSON.parse(JSON.stringify(payload)));
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
  Vue.set(state, 'workBookPage', payload);
  Vue.set(state.workBookPage, 'textLayers', payload.textLayers);
};

export const setMode = (state: IWorkBookState, payload: modesEnum) => {
  Vue.set(state, 'modes', {
    mode: payload,
    subMode: state.modes.subMode});
};

export const setSubMode = (state: IWorkBookState, payload: subModesEnum) => {
  Vue.set(state, 'modes', {
    mode: state.modes.mode,
    subMode: payload});
};

export const setSettings = (state: IWorkBookState, payload: {[key: string]: any}) => {
  Vue.set(state, 'settings', {...state.settings, ...JSON.parse(JSON.stringify(payload))});
};

export const setDialogs = (state: IWorkBookState, payload: {[key: string]: any}) => {
  Vue.set(state, 'dialogs', {...state.dialogs, ...payload});
};

export const setToolAction = (state: IWorkBookState, payload: toolActionEnum) => {
  state.toolAction = payload;
};
