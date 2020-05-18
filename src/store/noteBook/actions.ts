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
    }
  });
};
