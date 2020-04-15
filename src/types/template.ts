import { ITask } from './task';

export interface ITemplate extends ITask {
  taskId: string;
  keywords: string[];
  categories: string[];
  owner: string;
  public: boolean;
  author: {
    name: string;
    avatar: string | null;
  };
}
