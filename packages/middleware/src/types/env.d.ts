import type { IProcessEnvAugmentation } from '@package/types';

declare namespace NodeJS {
  export interface ProcessEnv extends IProcessEnvAugmentation {}
}
