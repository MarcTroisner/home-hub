import { Router } from 'express';

import { bodyValidator } from '@package/middleware';
import { spanValidator } from '@/validators/spanValidators';
import { collectSpan } from '@/handlers/collector';

const router = Router();

router.post('/', bodyValidator(spanValidator), collectSpan);

export default router;
