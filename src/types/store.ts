import { ITask, ITaskLink } from './task';

 /* tslint:disable-next-line:interface-over-type-literal */
type Dictionary < T > = { [key: string]: T };

/* BASE STATE */
export interface IEnvState {
  platform: EnvPlatformsEnum;
  browser: IEnvBrowser;
}

export interface IExtensionPopupState {
  popupWindowId: number;
  popupTabId: number;
}
export interface IExtensionState {
  extensionId: string | number;
  popup: IExtensionPopupState;
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
  user: IUser;
}

export interface IUpdateTask {
  user: IUser;
  task: ITask;
}

export interface IUpdateTaskLinks {
  vm: Vue;
  user: IUser;
  taskId: string;
  links: ITaskLink[];
  deleteId?: string;
}

export interface IOpenSidebar {
  url: string;
  vm: Vue;
  env: IEnvState;
  external: boolean;
}
