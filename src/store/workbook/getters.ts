import { IWorkBookState, IWorkBookPage } from '@/types';

export const getWorkBooks = (state: IWorkBookState) => {
  return state.workBooks;
};

export const getWorkBook = (state: IWorkBookState) => {
  return state.workBook;
};

export const getWorkBookPages = (state: IWorkBookState): IWorkBookPage[] => {
  return state.workBookPages;
};

export const getWorkBookPage = (state: IWorkBookState) => {
  return state.workBook.pages.find((page: IWorkBookPage) => {
    return page.id === state.currentPage;
  });
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
