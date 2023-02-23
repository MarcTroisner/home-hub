export interface IProcessEnvAugmentation {
  [key: string]: string | undefined;
  PORT?: string;
  NODE_ENV?: 'development' | 'production';
  SERVICE_NAME?: string;
}
