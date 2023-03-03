import type { IProcessEnvNode } from '@package/types/module-augmentation';

declare global {
  namespace NodeJS {
    interface ProcessEnv extends IProcessEnvNode {
      MONGO_URI?: string;
    }
  }
}
