import { Router } from 'express';
import { categoryController } from '../controllers/categoryController';
import { authenticate, requireRole } from '../middlewares/auth';

const router = Router();

router.get('/', categoryController.getCategories);
router.get('/:slug', categoryController.getCategoryBySlug);
router.post('/', authenticate, requireRole('ADMIN'), categoryController.createCategory);

export default router;
