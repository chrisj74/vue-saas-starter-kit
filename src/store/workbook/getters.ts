import { IWorkBookState, IWorkBookPage } from '@/types';

export const getWorkBooks = (state: IWorkBookState) => {
  return state.workBooks;
};

export const getWorkBook = (state: IWorkBookState) => {
  return state.workBook;
};

export const getWorkBookData = (state: IWorkBookState) => {
  return state.workBookData;
};

export const getWorkBookPages = (state: IWorkBookState): IWorkBookPage[] | undefined => {
  return state.workBook?.pages;
};

export const getWorkBookPage = (state: IWorkBookState) => {
  let currentPage: IWorkBookPage | undefined;
  if (state.workBook && state .workBook.pages) {
    currentPage = state.workBook.pages.find((page: IWorkBookPage) => {
      return page.id === state.currentPage;
    });
  }
  if (currentPage) {
    return currentPage;
  } else {
    return null;
  }
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
