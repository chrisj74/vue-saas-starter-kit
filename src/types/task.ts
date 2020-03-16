export interface ITask {
  title: string;
  description: string;
  tabs: ITaskTab[];
  videoPath?: string;
  videoObj?: ITaskVideoObj;
  profile?: string;
  modified?: Date;
  publishId?: string;
  id?: string;
  order: number;
  links: ITaskLink[];
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
