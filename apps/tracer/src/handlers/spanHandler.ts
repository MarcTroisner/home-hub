import type { Request, Response } from 'express';

export function saveSpan(req: Request, res: Response): void {
  res.send({ test: 'span-router' });
}
