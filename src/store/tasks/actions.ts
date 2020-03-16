import * as firebase from 'firebase';
import * as _ from 'lodash';
import * as axios from 'axios';
// import uuid from 'uuidv4';

/* Models */
import { IBasePayload, ITask, IUpdateTask, EnvPlatformsEnum, IOpenSidebar, IUpdateTaskLinks, ITaskLink } from '@/types';

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

export const openSidebar = (state: any, payload: IOpenSidebar) => {
  const windowWidth = Math.floor(window.screen.availWidth);
  const windowHeight = Math.floor(window.screen.availHeight);
  const popupWidth = 500;
  if (payload.env && payload.env.platform === EnvPlatformsEnum.EXTENSION) {
    const popupURL = window.chrome.runtime.getURL('sidebar.html');
    window.chrome.windows.getCurrent({populate: false}, function(currentWindow: any) {
      /* get the current window so we can set it back on leave */
      window.chrome.extension.sendMessage({ type: 'setLastFocusedWindowId', lastFocusedId:  currentWindow.id},
      function(res: any) {
        /* set the current window size */
        window.chrome.windows.update(currentWindow.id, { width: (windowWidth - popupWidth), top: 0, left: 0 });

        /* Set url */
        let url = popupURL + '/#' + payload.url;
        if (payload.external) {
          url = payload.url;
        }

        if (!res.popupWindowId) {
          /* Not open : so open */
          const newWin = {
            url,
            type: 'normal',
            height: windowHeight,
            width: popupWidth,
            top: 0,
            left: (windowWidth - popupWidth),
          };
          window.chrome.windows.create(newWin);
        } else {
          /* Already open so just focus */
          window.chrome.windows.update(res.popupWindowId, { focused: true });
          if (payload.external) {
            /* External so open new tab */
            window.chrome.tabs.create({
              windowId: res.popupWindowId,
              url,
              active: true,
            });
          } else {
            /* Internal so update tab */
            window.chrome.tabs.update(res.popupTabId, {
              url,
              active: true,
            });
          }
        }
      });
    });
  } else if (payload.env && payload.env.platform === EnvPlatformsEnum.WEBSERVER) {
    window.resizeTo((windowWidth - popupWidth), windowHeight);
    window.moveTo(0, 0);
    window.open(
      '/#' + payload.url,
      'workalongo',
      'top=0, left=' + (windowWidth - popupWidth) + ', width=' + popupWidth + ', height=' + windowHeight + ',toolbar=1, scrollbars=1, location=1, statusbar=1, menubar=1');
  }
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
          console.error('Error deleting document: ', error);
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
