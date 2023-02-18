declare namespace NodeJS {
  export interface ProcessEnv {
    [key: string]: string | undefined;
    NODE_ENV?: 'development' | 'production';
    SERVICE_NAME?: string;
  }
}
