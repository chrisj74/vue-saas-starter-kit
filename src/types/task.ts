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
    owners: string[];
    writers: string[];
    viewers: string[];
  };
  template: boolean;
  sourceId: string | null | undefined;
  keywords: string[];
  categories: string[];
  public: boolean;
  author: {
    name: string;
    avatar: string | null;
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
  id?: string | null;
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
  EMBED = 'embed',
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
