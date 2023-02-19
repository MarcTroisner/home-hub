import type { Request, Response } from 'express';

import express from 'express';
import cookieParser from 'cookie-parser';
import { json } from 'body-parser';

const app = express();

app.use(json());
app.use(cookieParser());

app.get('/', (req: Request, res: Response): void => {
  res.send({ root: 'web-api' });
});

app.listen(8000, (): void => {
  console.log(`App listening on port ${8000}`);
});
