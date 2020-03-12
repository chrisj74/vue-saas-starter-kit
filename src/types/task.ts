export enum taskTabTypesEnum {
  HOME = 'home',
  LINKS = 'links',
  INFO = 'info',
}

export interface ITaskTab {
  type: taskTabTypesEnum;
  icon: string;
}

export interface ITaskTabs {
  [index: number]: ITaskTab;
}
