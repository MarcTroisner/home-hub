import type { IProcessEnvNode } from '@package/types/module-augmentation';

declare namespace NodeJS {
  export interface ProcessEnv extends IProcessEnvNode {}
}
