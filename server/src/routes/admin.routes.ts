import { Router } from 'express';
import { adminController } from '../controllers/adminController';

const router = Router();

// Editorial desk endpoints (no sign-in required)
router.get('/stats', adminController.getStats);
router.get('/articles', adminController.getAllArticles);
router.patch('/articles/:id/status', adminController.updateArticleStatus);
router.get('/users', adminController.getUsers);
router.patch('/users/:id/role', adminController.updateUserRole);

export default router;
