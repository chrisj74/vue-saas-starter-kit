export interface INoteBook {
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
  srcDocUrl?: string;
  connectedUrl?: string;
  profile?: string[];
  modified?: Date;
  publishId?: string;
  id: string;
  text: string;
}
