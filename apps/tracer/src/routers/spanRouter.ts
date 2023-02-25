import { Router } from 'express';

import { bodyValidator } from '@package/middleware';
import { spanValidator } from '@/validators/spanValidators';
import { saveSpan } from '@/handlers/spanHandler';

const router = Router();

router.post('/', bodyValidator(spanValidator), saveSpan);

export default router;
