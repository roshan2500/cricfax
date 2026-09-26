import { Router } from 'express';
import { articleController } from '../controllers/articleController';

const router = Router();

// Public news routes
router.get('/', articleController.getArticles);
router.get('/breaking', articleController.getBreaking);
router.get('/featured', articleController.getFeatured);
router.get('/:slug', articleController.getBySlug);

// Editorial creation and management (no sign-in required)
router.post('/', articleController.createArticle);
router.put('/:id', articleController.updateArticle);
router.delete('/:id', articleController.deleteArticle);

// Reader comments
router.post('/:id/comments', articleController.addComment);

export default router;
