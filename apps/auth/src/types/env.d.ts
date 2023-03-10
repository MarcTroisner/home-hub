declare global {
  namespace NodeJS {
    interface ProcessEnv {
      [key: string]: string | undefined;
      PORT?: string;
      NODE_ENV?: 'development' | 'production' | 'test';
      SERVICE_NAME?: string;
    }
  }
}
