import { INoteBookState } from '@/types';

export const getNoteBooks = (state: INoteBookState) => {
  return state.noteBooks;
};

export const getNoteBook = (state: INoteBookState) => {
  return state.noteBook;
};

export const getNoteBookSettings = (state: INoteBookState) => {
  return state.settings;
};
