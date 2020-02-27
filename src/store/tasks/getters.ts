/* Models */
import { ITask } from '@/types';

export const getTasks = (state: any) => {
  return state.tasks;
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
