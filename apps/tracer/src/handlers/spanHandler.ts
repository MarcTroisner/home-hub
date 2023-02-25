import type { Request, Response } from 'express';
import type { ISpan } from '@package/models';

import { SpanModel } from '@package/models';

export async function saveSpan(req: Request<{}, {}, ISpan>, res: Response): Promise<void> {
  const span = new SpanModel({ ...req.body });

  try {
    req.app.logger.info(`Saving new span with id ${span.context.spanId}`);
    // await span.save();

    res.status(200).send(span.toJSON());
  } catch {
    req.app.responder.sync();
  }
}
