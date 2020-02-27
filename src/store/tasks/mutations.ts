import { ITask } from '@/types';

export const setTasks = (state: any, payload: ITask[]) => {
  state.tasks = payload;
};

export const addTask = (state: any, payload: ITask) => {
  const newTask = payload;
  state.tasks.unshift(newTask);
};
