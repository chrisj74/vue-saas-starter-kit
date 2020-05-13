import { IWorkBookState, IWorkBookPage } from '@/types';

export const getWorkBooks = (state: IWorkBookState) => {
  return state.workBooks;
};

export const getWorkBook = (state: IWorkBookState) => {
  return state.workBook;
};

export const getWorkBookTextLayers = (state: IWorkBookState) => {
  return state.workBookPage?.textLayers;
};

export const getWorkBookData = (state: IWorkBookState) => {
  return state.workBookData;
};

export const getWorkBookPages = (state: IWorkBookState): IWorkBookPage[] | undefined => {
  return state.workBook?.pages;
};

export const getWorkBookPage = (state: IWorkBookState) => {
  return state.workBookPage;
};

export const getCurrentPageDimensions = (state: IWorkBookState) => {
  return state.currentPageDimensions;
};


export const getCurrentPageId = (state: IWorkBookState) => {
  return state.currentPage;
};

export const getSettings = (state: IWorkBookState) => {
  return state.settings;
};

export const getModes = (state: IWorkBookState) => {
  return state.modes;
};

export const getToolAction = (state: IWorkBookState) => {
  return state.toolAction;
};

export const getDialogs = (state: IWorkBookState) => {
  return state.dialogs;
};
