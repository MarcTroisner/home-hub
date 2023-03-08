import type { Request, Response } from 'express';

import { SpanModel } from '@package/models';

export async function collectSpan(req: Request, res: Response): Promise<void> {
  const span = new SpanModel(req.body);

  await span.save()
    .then(() => res.sendStatus(201))
    .catch(req.app.responder.sync);
}
