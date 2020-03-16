/* Models */
import { ITask } from '@/types';

export const getTasks = (state: any) => {
  return state.tasks;
};

export const getShowLinks = (state: any) => {
  return state.showLinks;
};

export const getTaskById = (state: any) => (id: string) => {
  if (state.tasks && id) {
    return state.tasks.find((task: ITask) => {
      return task.id === id;
    });
  } else {
    return null;
  }
};

export const getAllWindows = (state: any, getters: any, rootState: any) => {
  if (state.allWindows) {
    const extensionUrl = 'chrome-extension://' + rootState.base.extension.extensionId;
    const allWindows = JSON.parse(JSON.stringify(state.allWindows));
    allWindows.forEach((win: any) => {
      win.tabs = win.tabs.filter((tab: any) => {
        return tab.url.indexOf('chrome://') === -1 && tab.url.indexOf( extensionUrl ) === -1;
      });
    });
    return allWindows;
  } else {
    return [];
  }

};
