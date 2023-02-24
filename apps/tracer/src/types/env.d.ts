import type { IProcessEnvAugmentation } from '@package/types';

declare global {
  namespace NodeJS {
    interface ProcessEnv extends IProcessEnvAugmentation {
      MONGO_URI?: string;
    }
  }
}
