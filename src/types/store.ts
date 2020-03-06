 /* tslint:disable-next-line:interface-over-type-literal */
type Dictionary < T > = { [key: string]: T };

/* BASE STATE */
export interface IEnvState {
  platform: EnvPlatformsEnum;
  browser: IEnvBrowser;
}

export interface IEnvBrowser {
    name: string;
    version: string | number;
}

export enum EnvPlatformsEnum {
  WEBSERVER = 'webserver',
  EXTENSION = 'extension',
  OFFICE = 'office',
}

/* USER STATE */
export interface IUser {
  id: string;
  name: string;
  email: string;
  photoUrl: string;
}

export interface ICreds {
  password: string;
  email: string;
}

export interface ILoginData {
  vm: Vue;
  email: string;
  password: string;
  redirect?: Dictionary<string | Array<string | null>>;
}

/* TASKS STATE */
export interface IBasePayload {
  vm: Vue;
  user: IUser;
}

export interface ITask {
  title: string;
  description: string;
  profile?: string;
  modified?: Date;
  publishId?: string;
  id?: string;
  order: number;
  links: ITaskLink[];
}

export interface ITaskLink {
  url: string;
  favicon: string;
  modified: Date;
  id?: string;
  order?: number;
}

export interface IAddTask {
  vm: Vue;
  user: IUser;
  task: ITask;
}

export interface IAddTaskLink {
  vm: Vue;
  user: IUser;
  taskId: string;
  links: ITaskLink[];
}

export interface IOpenSidebar {
  url: string;
  vm: Vue;
  env: IEnvState;
}
