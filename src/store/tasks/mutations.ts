import { ITask } from '@/types';

export const setTasks = (state: any, payload: ITask[]) => {
  state.tasks = payload;
};
