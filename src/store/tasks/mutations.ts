import Vue from 'vue';
import { ITask } from '@/types';

export const setTasks = (state: any, payload: ITask[]) => {
  console.log('mutation setTasks payload=', [...payload]);
  console.log('pre state=', {...state});
  Vue.set(state, 'tasks', [...payload]);
  // state.tasks = payload;
  console.log('post state=', {...state});
};
