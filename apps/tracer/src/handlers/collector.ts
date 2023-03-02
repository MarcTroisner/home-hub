import type { Request, Response } from 'express';
import type { ISpan } from '@package/models';

import { SpanModel } from '@package/models';

export async function collectSpan(req: Request<{}, {}, ISpan>, res: Response): Promise<void> {
  const span = new SpanModel({ ...req.body });

  try {
    throw new Error('oh no');
    req.app.logger.info(`Saving new span with id ${span.context.spanId}`);
    await span.save();

    res.status(201);
  } catch (e) {
    req.app.responder.sync(e);
  }
}
