import type { Request, Response } from 'express';

import express from 'express';
import { httpLogger, appLogger } from '@package/middleware';

const app = express();

app.use(httpLogger());
app.use(appLogger);

app.get('/', (req: Request, res: Response): void => {
  req.app.logger.error('Test message');
  res.send({ root: 'web-api' });
});

app.listen(8000, (): void => {
  console.log(`App listening on port ${8000}`);
});
