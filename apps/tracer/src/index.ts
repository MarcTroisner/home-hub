import type { Request, Response } from 'express';

import express from 'express';

const app = express();

app.get('/', (_req: Request, res: Response): void => {
  res.send({ root: 'tracer-api' });
});

app.listen(8002, (): void => {
  console.log(`App listening on port ${8002}`);
});
