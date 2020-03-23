export enum taskRolesEnum {
  OWNER = 'owner',
  READER = 'reader',
  WRITER = 'writer',
  VIEWER = 'viewer',
}
export interface ITaskRole  {
  [key: string]: taskRolesEnum;
}
export interface ITask {
  roles: {
    [key: string]: taskRolesEnum;
  };
  members: string[];
  title: string;
  description: string;
  tabs: ITaskTab[];
  currentTab: string | null;
  notes?: ITaskNotesObj;
  videoPath?: string;
  videoObj?: ITaskVideoObj;
  profile?: string;
  modified?: Date;
  publishId?: string;
  id?: string;
  order: number;
  links: ITaskLink[];
}

export interface ITaskNotesObj {
  commit: number;
  content: string;
}

export interface ITaskVideoObj {
  id: string;
  service: string;
}

export interface ITaskLink {
  url: string;
  favIconUrl: string;
  modified: Date;
  title?: string;
  id?: string;
  order?: number;
}

export enum taskTabTypesEnum {
  HOME = 'home',
  LINKS = 'links',
  INFO = 'info',
  NOTES = 'notes',
  DOCS = 'docs',
  CALCULATOR = 'calculator',
  YOUTUBE = 'youtube',
}

export interface ITaskTab {
  type: taskTabTypesEnum;
  icon?: string;
  label?: string;
  description?: string;
  active?: boolean;
}

export interface ITaskTabs {
  [index: number]: ITaskTab;
}
