import { Router } from 'express';
import {
    addArticle,
    updateArticle,
    deleteArticle,
    searchArticles,
    getArticleById,
    getAllArticles
} from './article.controller.js';

const router = Router();

router.post('/article', addArticle);
router.put('/article/:articleId', updateArticle);
router.delete('/article/:articleId', deleteArticle);
router.get('/article/search', searchArticles);
router.get('/article/:articleId', getArticleById);
router.get('/articles', getAllArticles);

export default router;
