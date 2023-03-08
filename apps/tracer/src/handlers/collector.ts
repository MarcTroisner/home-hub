import type { Request, Response } from 'express';

import { ESpanKind } from '@package/types/models';

export async function collectSpan(req: Request, res: Response): Promise<void> {
  req.app.tracer
    .start()
    .addSpan({ name: 'myspan', type: ESpanKind.CLIENT, mapping: 'test' })
    .addSpanAttribute({ mapping: 'test', attributes: { my: 'attribute' } })
    .addSpanEvent({ mapping: 'test', event: { name: 'My event' } })
    .finishSpan({ mapping: 'test' });

  res.send(req.app.tracer.$_state);
}
