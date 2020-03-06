/* Models */
import { ITask } from '@/types';

export const getTasks = (state: any) => {
  console.log('getter tasks=', state.tasks);
  return state.tasks;
};

export const getTaskById = (state: any) => (id: string) => {
  console.log('getter id=', id);
  if (state.tasks && id) {
    return state.tasks.find((task: ITask) => {
      return task.id === id;
    });
  } else {
    return null;
  }
};
