export interface IProcessEnvAugmentation {
  [key: string]: string | undefined;
  NODE_ENV?: 'development' | 'production';
  SERVICE_NAME?: string;
}
