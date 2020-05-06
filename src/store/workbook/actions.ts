/* Libs */
import merge from 'lodash/merge';
import * as firebase from 'firebase';
/* Models */
import { IWorkBook, IWorkBookPage, IWorkBookState, IUpdateWorkBookPage } from '@/types';
import workbook from '.';

export const setWorkBooks = async (
  {state, commit, dispatch, rootState }: {state: IWorkBookState, commit: any, dispatch: any, rootState: any},
  payload: IWorkBook[]) => {
    if (rootState.user.user) {
      let workBooks: IWorkBook[] = [];
      let promiseArray: any[] = [];
      const workBookRef = firebase
        .firestore()
        .collection('/workBooks/')
        .where('members', 'array-contains', firebase.auth().currentUser?.email)
        .where('template', '==', false)
        .orderBy('modified', 'desc');
      workBookRef.onSnapshot((function(workBookCollectionRef: any) {
          workBooks = [];
          promiseArray = [];
          workBookCollectionRef.forEach((doc: any) => {
            const workBook: IWorkBook = JSON.parse(JSON.stringify(doc.data()));
            workBooks.push(workBook);
            const pagesPromise = new Promise((resolve, reject) => {
              // const pagePromise: Promise<any> = new Promise((resolve, reject) => {
              const pagesRef = doc.ref.collection('pages/')
              .orderBy('order', 'asc').get();
              resolve(pagesRef);
            });
            promiseArray.push(pagesPromise);
          });
          Promise.all(promiseArray).then((results: any) => {
            results.forEach((pages: any, index: number) => {
              const workBook = workBooks[index];
              workBook.pages = [];
              pages.forEach((page: any) => {
                workBook.pages.push(JSON.parse(JSON.stringify(page.data())));
              });
            });
            commit('setWorkBooks', workBooks);
          });

          // may need Promise all for sub collections
        }), (error: any) => {
          console.error('Problem accessing WorkBooks data: ', error);
        });
    }
};

export const setWorkBook = (
  {state, commit, dispatch, rootState }: {state: IWorkBookState, commit: any, dispatch: any, rootState: any},
  payload: string) => {
  return new Promise((resolve, reject) => {
    let existingWorkBook: IWorkBook | undefined;
    if (state.workBooks) {
      existingWorkBook = state.workBooks.find((workBook: IWorkBook) => {
        return workBook.id === payload;
      });
    }

    if (existingWorkBook) {
      if (rootState.user.user) {
        firebase
          .firestore()
          .collection('workBooks')
          .doc(payload)
          .onSnapshot(function(workBookRef: any) {
            const workBook: IWorkBook = JSON.parse(JSON.stringify(workBookRef.data()));
            workBook.pages = [];
            const pagesRef = workBookRef.ref.collection('pages/')
            .orderBy('order', 'asc').get();
            pagesRef.then((pages: any) => {
              pages.forEach((page: any) => {
                workBook.pages.push(JSON.parse(JSON.stringify(page.data())));
              });

              if (existingWorkBook
                && (!state.workBook
                  || state.workBook.id !== workBook.id
                  || !workBook.commit
                  || workBook.commit === 0
                  || (state.workBook.id === workBook.id && workBook.commit > state.workBook.commit) )
              ) {
                commit('setWorkBook', workBook);
                resolve(true);
              } else {
                resolve(true);
              }
            }, (error: any) => {
              console.error('Problem accessing Set WorkBook pages collection: ', error);
            });
          }, (error: any) => {
            console.error('Problem accessing Set WorkBook data: ', error);
          });
      } else {
        const workBook: IWorkBook = existingWorkBook;
        commit('setWorkBook', existingWorkBook);
        resolve(true);
      }

    } else {
      console.error('needs new workbook');
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

export const updateWorkBookPage = (
  {state, commit, dispatch, rootState }: {state: IWorkBookState, commit: any, dispatch: any, rootState: any},
  payload: IUpdateWorkBookPage) => {
    if (state.workBook) {
      const newWorkBook: IWorkBook = JSON.parse(JSON.stringify(state.workBook));
      newWorkBook.commit++;
      let currentPage: IWorkBookPage | undefined = newWorkBook.pages.find((page: IWorkBookPage) => {
        return page.id === payload.workbookPageId;
      });
      if (currentPage) {
        currentPage = merge(currentPage, payload.page);
        commit('setWorkBook', newWorkBook);
        if (rootState.user.user ) {
          firebase
            .firestore()
            .collection('workBooks/' + payload.workBookId + '/pages').doc(payload.workbookPageId)
            .update(currentPage)
            .then(() => {
              /* update parent to trigger snapshot update */
              firebase
              .firestore()
              .collection('workBooks/').doc(payload.workBookId)
              .update({
                modified: new Date(),
                commit: newWorkBook.commit,
              });
            });
        }
      }
    }
};

export const addWorkBook = (
  {state, commit, dispatch, rootState }: {state: IWorkBookState, commit: any, dispatch: any, rootState: any},
  payload: IWorkBook) => {
    return new Promise((resolve, reject) => {
      if (rootState.user.user) {
        const pages = JSON.parse(JSON.stringify(payload.pages));
        delete payload.pages;
        const newDocRef = firebase
          .firestore()
          .collection('workBooks').doc(payload.id);
        newDocRef.set(payload)
          .then(function(docRef) {
            const pagesCollection = newDocRef.collection('/pages/');
            pages.forEach((page: IWorkBookPage) => {
              pagesCollection.doc(page.id).set(page);
            });
            newDocRef.update({modified: new Date()});
            resolve(payload.id);
          })
          .catch(function(error) {
            console.error('Error adding document: ', error);
          });
      } else {
        commit('addWorkBook', payload);
      }
    });
};
