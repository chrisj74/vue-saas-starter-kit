/* Libs */
import merge from 'lodash/merge';
import * as firebase from 'firebase';
/* Models */
import { IWorkBook, IWorkBookPage, IWorkBookState, IUpdateWorkBookPage, ITextLayer } from '@/types';

export const setWorkBooks = (
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
        console.log('FIREBASE READ workBooks collection');
        workBooks = [];
        promiseArray = [];
        workBookCollectionRef.forEach((doc: any) => {
          const workBook: IWorkBook = JSON.parse(JSON.stringify(doc.data()));
          workBooks.push(workBook);
          /* const pagesPromise = new Promise((resolve, reject) => {
            // const pagePromise: Promise<any> = new Promise((resolve, reject) => {
            const pagesRef = doc.ref.collection('pages/')
            .orderBy('order', 'asc').get();
            resolve(pagesRef);
          });
          promiseArray.push(pagesPromise); */
        });
        commit('setWorkBooks', workBooks);
        /* Promise.all(promiseArray).then((results: any) => {
          results.forEach((pages: any, index: number) => {
            const workBook = workBooks[index];
            workBook.pages = [];
            pages.forEach((page: any) => {
              workBook.pages.push(JSON.parse(JSON.stringify(page.data())));
            });
          });
          commit('setWorkBooks', workBooks);
        }); */

        // may need Promise all for sub collections
      }), (error: any) => {
        console.error('Problem accessing WorkBooks data: ', error);
      });
    }
};

export const setWorkBook = (
  {state, commit, dispatch, rootState }: {state: IWorkBookState, commit: any, dispatch: any, rootState: any},
  payload: string) => {
  console.log('ACTIOn setWorkBook');
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
            console.log('FIREBASE READ workBook DOC');
            const workBook: IWorkBook = JSON.parse(JSON.stringify(workBookRef.data()));
            const pagesRef = workBookRef.ref.collection('pages/')
            .orderBy('order', 'asc')/* .get() */;
            console.log('GET pages');
            // pagesRef.then((pages: any) => {
            pagesRef.onSnapshot((pages: any) => {
              workBook.pages = [];
              console.log('FIREBASE READ workBook PAGE DOC');
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
                dispatch('setWorkBookPage');
                resolve(workBook);
              } else {
                resolve(workBook);
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
        dispatch('setWorkBookPage');
        resolve(workBook);
      }
    } else {
      console.error('needs new workbook');
      // NEW WORKBOOK NEEDED
      resolve(false);
    }
  });
};

export const setCurrentPage = (
  {state, commit, dispatch, rootState }: {state: IWorkBookState, commit: any, dispatch: any, rootState: any},
  payload: string) => {
    return new Promise((resolve, reject) => {
      commit('setCurrentPage', payload);
      dispatch('setWorkBookPage');
      resolve();
    });
};

export const setWorkBookPages = (
  {state, commit, dispatch }: {state: IWorkBookState, commit: any, dispatch: any},
  payload: IWorkBookPage[]) => {
  console.log('ACTION set pages', payload);
  commit('setWorkBookPages', payload);
};

export const setWorkBookPage = (
  {state, commit, dispatch }: {state: IWorkBookState, commit: any, dispatch: any}) => {
  let currentPage: IWorkBookPage | undefined;
  if (state.workBook && state.workBook.pages) {
    currentPage = state.workBook.pages.find((page: IWorkBookPage) => {
      return page.id === state.currentPage;
    });
  }
  if (currentPage) {
    commit('setWorkBookPage', currentPage);
  } else if (state.workBook) {
    currentPage = state.workBook.pages[0];
    commit('setWorkBookPage', currentPage);
    commit('setCurrentPage', currentPage.id);
  }
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
          .update(currentPage);
      }
    }
    }
};

export const updatePageText = (
  {state, commit, dispatch, rootState }: {state: IWorkBookState, commit: any, dispatch: any, rootState: any},
  payload: {workBookKey: string, pageKey: string, index: number, textLayer: ITextLayer}) => {
  const newWorkBook: IWorkBook = JSON.parse(JSON.stringify(state.workBook));
  newWorkBook.commit++;
  const currentPage: IWorkBookPage | undefined = newWorkBook.pages.find((page: IWorkBookPage) => {
    return page.id === payload.pageKey;
  });
  if (currentPage && currentPage.textLayers[payload.index]) {
    if (payload.textLayer) {
      currentPage.textLayers[payload.index] = merge(currentPage.textLayers[payload.index], payload.textLayer);
    } else {
      currentPage.textLayers.splice(payload.index, 1);
      const newSetting = {
        activeEditor: currentPage.textLayers.length - 1,
      };
      commit('setSettings', newSetting);
    }
  } else if (currentPage && currentPage.textLayers) {
    currentPage.textLayers.push(payload.textLayer);
  }
  if (currentPage) {
    commit('setWorkBook', newWorkBook);
    commit('setWorkBookPage', currentPage);
    return new Promise((resolve, reject) => {
      const workBookPageRef = firebase
      .firestore()
      .collection('workBooks/' + payload.workBookKey + '/pages/').doc(payload.pageKey);
      workBookPageRef.update({
        commit: currentPage.commit,
        textLayers: currentPage.textLayers,
      });
      resolve();
    });
  }
};

export const addWorkBook = (
  {state, commit, dispatch, rootState }: {state: IWorkBookState, commit: any, dispatch: any, rootState: any},
  payload: IWorkBook) => {
  console.log('ACTION add workbook');
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
