import * as firebase from 'firebase';
import * as _ from 'lodash';
import * as axios from 'axios';
// import uuid from 'uuidv4';

/* Models */
import { IBasePayload, ITask, IUpdateTask, EnvPlatformsEnum,
   IOpenSidebar, IUpdateTaskLinks, ITaskLink, windowTypeEnum, IExtensionSidebarState } from '@/types';

export const setTasks = ({ commit }: {commit: any}, payload: IBasePayload) => {
  let tasks: ITask[] = [];

  firebase
  .firestore()
  .collection('users/' + payload.user.id + '/tasks/')
  .orderBy('modified', 'desc').onSnapshot(function(tasksCollectionRef: any) {
    tasks = [];
    tasksCollectionRef.forEach((doc: any) => {
      const task: ITask = JSON.parse(JSON.stringify(doc.data()));
      task.id = doc.id;
      tasks.push(task);
      doc.ref.collection('links/')
      .orderBy('order', 'asc').onSnapshot((linksCollectionRef: any) => {
        task.links = [];
        linksCollectionRef.forEach((linkRef: any ) => {
          const link = JSON.parse(JSON.stringify(linkRef.data()));
          link.id = linkRef.id;
          task.links.push(link);
        });
      });
    });
    // may need Promise all for sub collections
    commit('setTasks', tasks);
  });
};

export const addTask = ({ commit }: {commit: any}, payload: IUpdateTask) => {
  return new Promise((resolve, reject) => {
    const userDoc = firebase
      .firestore()
      .collection('users/').doc(payload.user.id);
    userDoc.update({
      lastUpdated: new Date(),
    });

    userDoc
      .collection('tasks').add(payload.task)
      .then(function(docRef) {
        resolve(docRef.id);
      })
      .catch(function(error) {
          console.error('Error adding document: ', error);
      });
  });
};

export const updateTaskLinks = (state: any, payload: IUpdateTaskLinks) => {
  return new Promise((resolve, reject) => {
    const linksCollection = firebase
      .firestore()
      .collection('users/' + payload.user.id + '/tasks/' + payload.taskId + '/links/');

    payload.links.forEach((link: ITaskLink, index: number) => {
      if (link.id && payload.deleteId && link.id === payload.deleteId) {
        // Delete
        linksCollection.doc(link.id).delete();
      } else if (link.id) {
        // Has id so must be in firestore already
        linksCollection.doc(link.id)
        .update({
          order: index,
        });
      } else {
        // New link to add
        link.order = index;
        linksCollection.add(link);
      }
    });
    /* Need to update parent */
    const userDoc = firebase
      .firestore()
      .collection('users/').doc(payload.user.id);
    userDoc.update({
      lastUpdated: new Date(),
    });
    resolve(payload.links);
  });
};

export const updateAllWindows = ({ commit }: {commit: any}, payload: any[]) => {
  commit('setAllWindows', payload);
};

export const updateTask = (state: any, payload: IUpdateTask) => {
  return new Promise((resolve, reject) => {
    const userDoc = firebase
      .firestore()
      .collection('users/').doc(payload.user.id);
    userDoc.update({
      lastUpdated: new Date(),
    });

    userDoc
      .collection('tasks').doc(payload.task.id).update(payload.task)
      .then(() => {
        resolve(true);
      })
      .catch(function(error) {
          console.error('Error updating document: ', error);
      });
  });
};

export const deleteTask = (state: any, payload: IUpdateTask) => {
  return new Promise((resolve, reject) => {
    const userDoc = firebase
      .firestore()
      .collection('users/').doc(payload.user.id);
    userDoc.update({
      lastUpdated: new Date(),
    });

    userDoc
      .collection('tasks').doc(payload.task.id).delete()
      .then(() => {
        resolve(true);
      })
      .catch(function(error) {
          console.error('Error deleting document: ', error);
      });
  });
};

export const cloneTask = (state: any, payload: any) => {
  //
};

export const openSidebar =
  ({state, rootState, commit, rootGetters}: {state: any, rootState: any, commit: any, rootGetters: any},
   payload: IOpenSidebar) => {
  const windowWidth = Math.floor(window.screen.availWidth);
  const windowHeight = Math.floor(window.screen.availHeight);
  const sidebarWidth = 500;
  if (rootState.base.env && rootState.base.env.platform === EnvPlatformsEnum.EXTENSION) {
    const sidebarURL = window.chrome.runtime.getURL('sidebar.html');
    const windowType = rootGetters['base/getWindowType'];
    const extension = rootGetters['base/getExtension'];
    /* Set url */
    let url = sidebarURL + '/#' + payload.url;
    if (payload.external) {
      url = payload.url;
    }

    if (windowType !== windowTypeEnum.SIDEBAR) {
      window.chrome.windows.getCurrent({populate: false}, function(currentWindow: any) {
        /* get the current window so we can set it back on leave */
        if (windowType === windowTypeEnum.TAB) {
          window.chrome.extension.sendMessage({ type: 'setLastFocusedWindowId', lastFocusedId:  currentWindow.id},
            function(res: any) {
              /* set the current window size */
              window.chrome.windows.update(currentWindow.id, { width: (windowWidth - sidebarWidth), top: 0, left: 0 });
            },
          );
        }

        if (!extension.sidebar.sidebarWindowId) {
          /* Not open : so open */
          const newWin = {
            url,
            type: 'normal',
            height: windowHeight,
            width: sidebarWidth,
            top: 0,
            left: (windowWidth - sidebarWidth),
          };
          window.chrome.windows.create(newWin, (sidebarWin: any) => {
            const sidebar: IExtensionSidebarState = {
              sidebarTabId: payload.external ? null : sidebarWin.tabs[0].id,
              sidebarWindowId: sidebarWin.id,
            };
            payload.vm.$store.dispatch('base/setExtensionSidebar', sidebar);
          });
        } else {
          /* Already open so just focus */
          window.chrome.windows.update(extension.sidebar.sidebarWindowId, { focused: true });
          if (payload.external) {
            /* External so open new tab */
            window.chrome.tabs.create({
              windowId: extension.sidebar.sidebarWindowId,
              url,
              active: true,
            });
          } else if (extension.sidebar.sidebarTabId) {
            /* Internal and already has app open so update tab */
            window.chrome.tabs.update(extension.sidebar.sidebarTabId, {
              url,
              active: true,
            });
          } else {
            /* Internal but no tab open so create */
            window.chrome.tabs.create({
              windowId: extension.sidebar.sidebarWindowId,
              url,
              index: 0,
              active: true,
            },
            (sidebarTab: any): void => {
              // console.log('sidebar=', sidebarTab);
            });
          }
        }
      });
    } else {
      /* Already in sidebar */
      if (payload.external) {
        /* External so open new tab */
        window.chrome.tabs.create({
          windowId: extension.sidebar.sidebarWindowId,
          url,
          active: true,
        });
      } else {
        /* Internal so update tab */
        window.chrome.tabs.update(extension.sidebar.sidebarTabId, {
          url,
          active: true,
        });
      }
    }

  } else if (rootState.base.env && rootState.base.env.platform === EnvPlatformsEnum.WEBSERVER) {
    const url: string = payload.external ? payload.url : '/#' + payload.url;
    window.resizeTo((windowWidth - sidebarWidth), windowHeight);
    window.moveTo(0, 0);
    window.open(
      url,
      'workalongo',
      'top=0, left=' + (windowWidth - sidebarWidth) + ', width=' + sidebarWidth + ', height=' + windowHeight + ',toolbar=1, scrollbars=1, location=1, statusbar=1, menubar=1');
  }
};
