import * as firebase from 'firebase';
import * as _ from 'lodash';
import * as axios from 'axios';
import uuid from 'uuidv4';

/* Models */
import { IBasePayload, ITask, IAddTask, EnvPlatformsEnum, IOpenSidebar } from '@/types';

export const setTasks = (state: any, payload: IBasePayload) => {
  return new Promise((resolve, reject) => {
    firebase
        .firestore()
        .collection('users/' + payload.user.id + '/tasks/')
        .orderBy('modified', 'desc')
        .onSnapshot(function(querySnapshot) {
          const tasks: ITask[] = [];
          querySnapshot.forEach(function(doc) {
            tasks.push({
              id: doc.id,
              title: doc.data().title,
              profile: doc.data().profile,
              description: doc.data().description,
              modified: doc.data().modified.toDate(),
              publishId: doc.data().publishId,
            });
          });
          payload.vm.$store.commit('tasks/setTasks', tasks);
          resolve();
      });

  });
};

export const addTask = (state: any, payload: IAddTask) => {
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
        /*
        // Add deeper doc if needed
        docRef
          .collection('pages').add(payload.page)
            .then(function(pageRef) {

            });
        */
        resolve(docRef.id);
      })
      .catch(function(error) {
          console.error('Error adding document: ', error);
      });
  });
};

export const openSidebar = (state: any, payload: IOpenSidebar) => {
  const windowWidth = Math.floor(window.screen.availWidth);
  const windowHeight = Math.floor(window.screen.availHeight);
  const popupWidth = 500;
  if (payload.env && payload.env.platform === EnvPlatformsEnum.EXTENSION) {
    console.log('In extension');
    const popupURL = window.chrome.runtime.getURL('sidebar.html');
    window.chrome.windows.getCurrent({populate: false}, function(currentWindow: any) {
      /* get the current window so we can set it back on leave */
      window.chrome.extension.sendMessage({ type: 'setLastFocusedWindowId', lastFocusedId:  currentWindow.id},
      function(res: any) {
        console.log('currentWindow.id=', currentWindow.id);
        /* set the current window size */
        window.chrome.windows.update(currentWindow.id, { width: (windowWidth - popupWidth), top: 0, left: 0 });
        if (!res.popupWindowId) {
          /* Not open so open */
          window.chrome.windows.create({
            url: popupURL + '/#' + payload.url,
            type: 'normal',
            height: windowHeight,
            width: popupWidth,
            top: 0,
            left: (windowWidth - popupWidth),
          });
        } else {
          /* Already open so just focus */
          window.chrome.windows.update(res.popupWindowId, { focused: true });
        }
      });
    });
  } else if (payload.env && payload.env.platform === EnvPlatformsEnum.WEBSERVER) {
    console.log('In web app');
    window.resizeTo((windowWidth - popupWidth), windowHeight);
    window.moveTo(0, 0);
    window.open(
      '/#' + payload.url,
      'workalongo',
      'top=0, left=' + (windowWidth - popupWidth) + ', width=' + popupWidth + ', height=' + windowHeight + ',toolbar=1, scrollbars=1, location=1, statusbar=1, menubar=1');
  }
};

export const updateTask = (state: any, payload: any) => {
  //
};

export const deleteTask = (state: any, payload: any) => {
  //
};

export const cloneTask = (state: any, payload: any) => {
  //
};
