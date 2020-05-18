import { IWorkBook, IWorkBookPage } from './workBook';
import { INoteBook } from './noteBook';

/* tslint:disable-next-line:interface-over-type-literal */
type Dictionary < T > = { [key: string]: T };

/* BASE STATE */

export interface IBaseState {
  env: IEnvState;
  leftDrawerOpen: boolean;
  loading: boolean;
  error: string;
  extension: IExtensionState;
}

export interface IBasePayload {
  user: IUser;
}
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

/* WORKBOOK STATE */

export interface IWorkBookPageDimensions {
  maxWidth: number;
  maxWidthRatio: number;
  maxHeightRatio: number;
  height: number;
  width: number;
  zoom: number;
  pixelRatio: number;
}

export interface IWorkBookState {
  workBooks: IWorkBook[];
  workBook: IWorkBook | undefined;
  workBookData: Uint8Array | undefined;
  workBookPages: IWorkBookPage[];
  workBookPage: IWorkBookPage;
  currentPage: string | undefined;
  currentPageDimensions: IWorkBookPageDimensions;
  modes: {
    mode: modesEnum,
    subMode: subModesEnum,
  };
  settings: {
    showThumbs: boolean;
    color: string;
    brushWidth: number;
    showDrawingExtras: boolean;
  };
  dialogs: {
    export: boolean;
  };
  toolAction: toolActionEnum;
}

export interface IUpdateWorkBookPage {
  workBookId: string;
  workbookPageId: string;
  page: IWorkBookPage | Partial<IWorkBookPage>;
}

export enum toolActionEnum {
  ZOOM_IN = 'zoomIn',
  ZOOM_OUT = 'zoomOut',
  ADD_TEXT = 'addText',
  DELETE_TEXT = 'deleteText',

  PAGE_LOADED = 'pageLoaded',

  CLEAR_DRAWING = 'clearDrawing',

  GENERATE_PDF = 'generatePdf',
}

export enum modesEnum {
  TEXT = 'text',
  DRAW = 'draw',
}

export enum subModesEnum {
  INK = 'ink',
  ERASER = 'eraser',
  MARKER = 'marker',
  HIGHLIGHTER = 'highlighter',
  TYPE = 'type',
}

/* NOTES STATE */

export interface INoteBookState {
  noteBooks: INoteBook[];
  noteBook: INoteBook;
  settings: {
    showAddNoteDialog: boolean;
  };
}
