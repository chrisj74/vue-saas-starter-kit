import { INoteBookState } from '@/types';

export const getWorkBooks = (state: INoteBookState) => {
  return state.noteBooks;
};

export const getNoteBook = (state: INoteBookState) => {
  return state.noteBook;
};
