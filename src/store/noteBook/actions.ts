/* Libs */
import merge from 'lodash/merge';
import * as firebase from 'firebase';
/* Models */
import { INoteBookState, INoteBook } from '@/types';

export const setNoteBooks = (
  {state, commit, dispatch, rootState }: {state: INoteBookState, commit: any, dispatch: any, rootState: any},
  payload: INoteBook[]) => {
  if (rootState.user.user) {
    let noteBooks: INoteBook[] = [];
    const noteBookRef = firebase
      .firestore()
      .collection('/noteBooks/')
      .where('members', 'array-contains', firebase.auth().currentUser?.email)
      .where('template', '==', false)
      .orderBy('modified', 'desc');
    noteBookRef.onSnapshot((function(noteBookCollectionRef: any) {
      noteBooks = [];
      noteBookCollectionRef.forEach((doc: any) => {
        const noteBook: INoteBook = JSON.parse(JSON.stringify(doc.data()));
        noteBooks.push(noteBook);
      });
      console.log('ACTION setNoteBooks = ', noteBooks);
      commit('setNoteBooks', noteBooks);
    }), (error: any) => {
      console.error('Problem accessing NoteBooks data: ', error);
    });
  }
};

export const setNoteBook = (
  {state, commit, dispatch, rootState }: {state: INoteBookState, commit: any, dispatch: any, rootState: any},
  payload: string) => {
  return new Promise((resolve, reject) => {
    let existingNoteBook: INoteBook | undefined;
    if (state.noteBooks) {
      existingNoteBook = state.noteBooks.find((noteBook: INoteBook) => {
        return noteBook.id === payload;
      });
    }

    if (existingNoteBook) {
      if (rootState.user.user) {
        firebase
          .firestore()
          .collection('noteBooks')
          .doc(payload)
          .onSnapshot(function(noteBookRef: any) {
            if (noteBookRef && noteBookRef.data()) {
              const noteBook: INoteBook = JSON.parse(JSON.stringify(noteBookRef.data()));
              if (existingNoteBook
                && (!state.noteBook
                  || state.noteBook.id !== noteBook.id
                  || !noteBook.commit
                  || noteBook.commit === 0
                  || (state.noteBook.id === noteBook.id && noteBook.commit > state.noteBook.commit) )
              ) {
                commit('setNoteBook', noteBook);
                resolve(noteBook);
              } else {
                resolve(noteBook);
              }
            } else {
              /* It has been deleted */
              commit('setNoteBook', null);
              resolve(null);
            }
          }, (error: any) => {
            console.error('Problem accessing Set NoteBook data: ', error);
          });
      } else {
        /* No user */
        const noteBook: INoteBook = existingNoteBook;
        commit('setNoteBook', existingNoteBook);
        resolve(noteBook);
      }
    } else {
      console.error('needs new noteBook');
      // NEW NOTEBOOK NEEDED
      resolve(false);
    }
  });
};

export const updateNoteBook = (
  {state, commit, dispatch, rootState }: {state: INoteBookState, commit: any, dispatch: any, rootState: any},
  payload: Partial<INoteBook>) => {
  console.log('ACTION updateNoteBook');
  const newNoteBook: INoteBook = merge(JSON.parse(JSON.stringify(state.noteBook)), payload);
  newNoteBook.commit++;
  commit('setNoteBook', newNoteBook);
  return new Promise((resolve, reject) => {
    const noteBookRef = firebase
    .firestore()
    .collection('noteBooks/').doc(newNoteBook.id);
    noteBookRef.update(newNoteBook);
    resolve();
  });
};

export const addNoteBook = (
  {state, commit, dispatch, rootState }: {state: INoteBookState, commit: any, dispatch: any, rootState: any},
  payload: INoteBook) => {
  return new Promise((resolve, reject) => {
    if (rootState.user.user) {
      const newDocRef = firebase
        .firestore()
        .collection('noteBooks').doc(payload.id);
      newDocRef.set(payload)
        .then(() => {
          resolve();
        })
        .catch(function(error) {
          console.error('Error adding Note document: ', error);
          reject();
        });
    } else {
      commit('addNoteBook', payload);
      resolve();
    }
  });
};

export const deleteNoteBook = (
  {state, commit, dispatch, rootState }: {state: INoteBookState, commit: any, dispatch: any, rootState: any},
  payload: INoteBook) => {
  return new Promise((resolve, reject) => {
    if (rootState.user.user) {
      const newDocRef = firebase
        .firestore()
        .collection('noteBooks').doc(payload.id);
      newDocRef.delete()
        .then(() => {
          resolve();
        })
        .catch(function(error) {
          console.error('Error deleting Note document: ', error);
          reject();
        });
    } else {
      // commit('addNoteBook', payload);
      // resolve();
      /* No delete for non auth */
    }
  });
};
