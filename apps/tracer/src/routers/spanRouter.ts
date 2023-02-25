import { Router } from 'express';

import { saveSpan } from '@/handlers/spanHandler';

const router = Router();

router.post('/', saveSpan);

export default router;
