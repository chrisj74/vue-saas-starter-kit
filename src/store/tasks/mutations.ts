import Vue from 'vue';
import { ITask } from '@/types';

export const setTasks = (state: any, payload: ITask[]) => {
  Vue.set(state, 'tasks', [...payload]);
};

export const setTemplates = (state: any, payload: ITask[]) => {
  Vue.set(state, 'templates', [...payload]);
};

export const clearAll = (state: any) => {
  state.templates = null;
  state.tasks = null;
};

export const setAllWindows = (state: any, payload: any[]) => {
  Vue.set(state, 'allWindows', [...payload]);
};

export const setShowLinks = (state: any) => {
  state.showLinks++;
};
