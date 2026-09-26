import { Router } from 'express';
import authRoutes from './auth.routes';
import articleRoutes from './article.routes';
import categoryRoutes from './category.routes';
import searchRoutes from './search.routes';
import authorRoutes from './author.routes';
import adminRoutes from './admin.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/articles', articleRoutes);
router.use('/categories', categoryRoutes);
router.use('/search', searchRoutes);
router.use('/authors', authorRoutes);
router.use('/admin', adminRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'CricFax API',
    version: '1.0.0',
  });
});

export default router;
