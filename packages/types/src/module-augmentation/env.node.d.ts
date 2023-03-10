/**
 * @file Contains module-augmentation types for NodeJS environment variables
 */

export interface IProcessEnvNode {
  [key: string]: string | undefined;
  PORT?: string;
  NODE_ENV?: 'development' | 'production' | 'testing';
  SERVICE_NAME?: string;
}
