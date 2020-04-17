import { IWorkBook, IWorkBookPage, IWorkBookState } from '@/types';
import workbook from '.';

export const setWorkBooks = (
  {state, commit, dispatch }: {state: IWorkBookState, commit: any, dispatch: any},
  payload: IWorkBook[]) => {
  commit('setWorkBooks', payload);
};

export const setWorkBook = (
  {state, commit, dispatch, rootState }: {state: IWorkBookState, commit: any, dispatch: any, rootState: any},
  payload: {url: string, newWorkBook: IWorkBook}) => {
  return new Promise((resolve, reject) => {
    let existingWorkBook;
    if (state.workBooks && payload.url) {
      existingWorkBook = state.workBooks.find((workBook: IWorkBook) => {
        return workBook.url === payload.url;
      });
    }

    if (existingWorkBook) {
      // TODO: CODE TO RETRIEVE WORKBOOK & PAGES
      const workBook: IWorkBook = existingWorkBook;



      commit('setWorkBook', workBook);
      resolve(true);
    } else if (payload.newWorkBook) {
      console.log('newWorkBook');
      commit('setWorkBook', payload.newWorkBook);
      commit('addWorkBook', payload.newWorkBook);
      resolve(true);
    } else {
      console.log('needs new workbook');
      // NEW WORKBOOK NEEDED
      resolve(false);
    }
  });
};

export const setWorkBookPages = (
  {state, commit, dispatch }: {state: IWorkBookState, commit: any, dispatch: any},
  payload: IWorkBookPage[]) => {
  commit('setWorkBookPages', payload);
};

export const setWorkBookPage = (
  {state, commit, dispatch }: {state: IWorkBookState, commit: any, dispatch: any},
  payload: IWorkBookPage) => {
  commit('setWorkBookPage', payload);
};


