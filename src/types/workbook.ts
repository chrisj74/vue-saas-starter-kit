export enum workBookRolesEnum {
  OWNER = 'owner',
  READER = 'reader',
  WRITER = 'writer',
  VIEWER = 'viewer',
}
export interface IWorkBookRole  {
  [key: string]: workBookRolesEnum;
}

export interface IWorkBook {
  roles?: {
    owners: string[];
    writers: string[];
    viewers: string[];
  };
  members?: string[];
  template: boolean;
  sourceId: string | null | undefined;
  keywords: string[];
  categories: string[];
  public: boolean;
  author?: {
    name: string;
    avatar: string | null;
  };
  title?: string;
  description?: string;
  commit: number;
  url?: string;
  profile?: string[];
  modified?: Date;
  publishId?: string;
  id?: string | null;
  pages: IWorkBookPage[];
}

export interface IWorkBookPage {
  textLayers: ITextLayer[];
  dimensions: IPageDimensions;
  commit: number;
  modified?: Date;
  order?: number;
  id?: string;
}

export interface IPageDimensions {
  width: number;
  height: number;
}

export interface ITextLayer {
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  commit: number;
  borderWidth?: number;
  borderColor?: string;
  backgroundColor?: string;
  opacity?: number;
}


