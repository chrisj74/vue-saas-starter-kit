import * as firebase from 'firebase';
import * as _ from 'lodash';
// import * as axios from 'axios';
// import uuid from 'uuidv4';

/* Models */
import { IBasePayload, ITask, IUpdateTask, EnvPlatformsEnum,
   IOpenSidebar, IUpdateTaskLinks, ITaskLink, windowTypeEnum, IExtensionSidebarState, IUpdateTemplate, ITemplate } from '@/types';

export const setTasks = ({ commit }: {commit: any}, payload: IBasePayload) => {
  let tasks: ITask[] = [];
  firebase
  .firestore()
  .collection('/tasks/')
  .where('members', 'array-contains', firebase.auth().currentUser?.uid)
  .where('template', '==', false)
  .orderBy('modified', 'desc')
  .onSnapshot((function(tasksCollectionRef: any) {
    tasks = [];
    tasksCollectionRef.forEach((doc: any) => {
      const task: ITask = JSON.parse(JSON.stringify(doc.data()));
      task.id = doc.id;

      doc.ref.collection('links/')
      .orderBy('order', 'asc').onSnapshot((linksCollectionRef: any) => {
        task.links = [];
        linksCollectionRef.forEach((linkRef: any ) => {
          const link = JSON.parse(JSON.stringify(linkRef.data()));
          link.id = linkRef.id;
          task.links.push(link);
        }, (error: any) => {
          console.error('Problem accessing Task links data: ', error);
        });
      });
      tasks.push(task);
    });
    // may need Promise all for sub collections
    commit('setTasks', tasks);
  }), (error: any) => {
    console.error('Problem accessing Task data: ', error);
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

    firebase
      .firestore()
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
      .collection('/tasks/' + payload.taskId + '/links/');

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
    if (payload.user) {
      const userDoc = firebase
      .firestore()
      .collection('users/').doc(payload.user.id);
      userDoc.update({
        lastUpdated: new Date(),
      });

      payload.task.modified = new Date();
      firebase
        .firestore()
        .collection('tasks').doc(payload.task.id as string).update(payload.task)
        .then(() => {
          resolve(true);
        })
        .catch(function(error) {
            console.error('Error updating document: ', error);
        });
    } else {
      resolve();
    }

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
    /* Delete nested links first */
    const taskDoc = firebase
      .firestore()
      .collection('tasks/').doc(payload.task.id as string);

    taskDoc
      .collection('/links/')
      .get().then((linksSnapshot: any) => {
        linksSnapshot.forEach((val: any) => {
          val.ref.delete();
        });
      })
      .catch((error: any) => {
        console.error('Problem accessing Delete Task data: ', error);
      });

    /* Delete task doc */
    taskDoc.delete()
      .then(() => {
        resolve(true);
      })
      .catch(function(error: any) {
          console.error('Error deleting document: ', error);
      });
  });
};

export const setTemplates = ({ commit }: {commit: any}, payload: IBasePayload) => {
  let templates: ITask[] = [];
  firebase
  .firestore()
  .collection('/tasks/')
  .where('members', 'array-contains', firebase.auth().currentUser?.uid)
  .where('template', '==', true)
  .orderBy('modified', 'desc')
  .onSnapshot((function(templateCollectionRef: any) {
    templates = [];
    templateCollectionRef.forEach((doc: any) => {
      const template: ITask = JSON.parse(JSON.stringify(doc.data()));
      template.id = doc.id;

      doc.ref.collection('links/')
      .orderBy('order', 'asc').onSnapshot((linksCollectionRef: any) => {
        template.links = [];
        linksCollectionRef.forEach((linkRef: any ) => {
          const link = JSON.parse(JSON.stringify(linkRef.data()));
          link.id = linkRef.id;
          template.links.push(link);
        });
      }, (error: any) => {
        console.error('Problem accessing Template links data: ', error);
      });
      templates.push(template);
    });
    // may need Promise all for sub collections
    commit('setTemplates', templates);
  }), (error: any) => {
    console.error('Problem accessing Template data: ', error);
  });
};

export const fetchTemplate = (state: any, payload: string) => {
  return new Promise((resolve, reject) => {
    let newTask: ITask;
    firebase
      .firestore()
      .doc('/tasks/' + payload)
      .get()
      .then(function(docRef) {
        newTask = JSON.parse(JSON.stringify(docRef.data())) as ITask;
        docRef.ref.collection('links')
        .orderBy('order', 'asc')
        .get()
        .then((linksCollectionRef: any) => {
          newTask.links = [];
          linksCollectionRef.forEach((linkRef: any ) => {
            const link = JSON.parse(JSON.stringify(linkRef.data()));
            link.id = linkRef.id;
            newTask.links.push(link);
          });
        }, (error: any) => {
          console.error('Problem accessing Template links data: ', error);
        });
        resolve(newTask);
      })
      .catch(function(error) {
          console.error('Error fetching document: ', error);
      });
  });
};

export const cloneTask = (state: any, payload: IUpdateTask) => {
  return new Promise((resolve, reject) => {
    const userDoc = firebase
      .firestore()
      .collection('users/').doc(payload.user.id);
    userDoc.update({
      lastUpdated: new Date(),
    });

    /* copy and remove links */
    const links = payload.task.links;
    delete(payload.task.links);
    console.log('links=', links);
    firebase
      .firestore()
      .collection('/tasks/').add(payload.task)
      .then(function(docRef) {
        links.forEach((link: ITaskLink) => {
          docRef.collection('/links/').add(link);
        });
        resolve(docRef.id);
      })
      .catch(function(error) {
          console.error('Error adding document: ', error);
      });
  });
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
        if (windowType !== windowTypeEnum.SIDEBAR) {
          window.chrome.extension.sendMessage({ type: 'setLastFocusedWindowId', lastFocusedId:  currentWindow.id},
            function(res: any) {
              // response
            },
          );
          /* set the current window size */
          window.chrome.windows
          .update(extension.lastFocusedWindow, { width: (windowWidth - (sidebarWidth + 5)), top: 0, left: 0 });
        }

        if (!extension.sidebar.sidebarWindowId) {
          /* Not open : so open */
          const newWin = {
            url,
            type: 'normal',
            height: windowHeight,
            width: sidebarWidth,
            top: 0,
            left: (windowWidth - (sidebarWidth)),
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
    window.resizeTo((windowWidth - sidebarWidth), 200);
    window.moveTo(0, 0);
    window.open(
      url,
      'workalongo',
      'top=0, left=' + (windowWidth - sidebarWidth) + ', width=' + sidebarWidth + ', height=' + windowHeight + ',toolbar=1, scrollbars=1, location=1, statusbar=1, menubar=1');
  }
};
