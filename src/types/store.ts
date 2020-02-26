 /* tslint:disable-next-line:interface-over-type-literal */
type Dictionary < T > = { [key: string]: T };

export interface IEnvState {
  platform: EnvPlatforms;
  app: string;
}

export enum EnvPlatforms {
  WEBSERVER = 'webserver',
  EXTENSION = 'extension',
  OFFICE = 'office',
}

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
