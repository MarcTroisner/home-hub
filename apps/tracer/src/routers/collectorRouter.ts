import { Router } from 'express';

import { collectSpan } from '@/handlers/collector';

const router = Router();

router.post('/', collectSpan);

export default router;
