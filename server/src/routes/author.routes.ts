import { Router } from 'express';
import { authorController } from '../controllers/authorController';

const router = Router();

router.get('/:username', authorController.getAuthorByUsername);

export default router;
