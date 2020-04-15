import { ITask, ITaskLink } from './task';
import { ITemplate } from './template';

 /* tslint:disable-next-line:interface-over-type-literal */
type Dictionary < T > = { [key: string]: T };

/* BASE STATE */
export interface IEnvState {
  platform: EnvPlatformsEnum;
  browser: IEnvBrowser;
}

export interface IExtensionSidebarState {
  sidebarWindowId: number;
  sidebarTabId: number;
}

export interface IExtensionIds {
  windowId: number;
  tabId: number;
}
export interface IExtensionState {
  extensionId: string | number;
  windowId: number;
  tabId: number;
  lastFocusedWindow: number;
  sidebar: IExtensionSidebarState;
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

export enum windowTypeEnum {
  BROWSER = 'browser',
  SIDEBAR = 'sidebar',
  TAB = 'tab',
  POPUP = 'popup',
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

export interface IUpdateTemplate {
  user: IUser;
  template: ITemplate;
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
