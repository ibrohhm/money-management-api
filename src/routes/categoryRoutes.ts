import { Router } from 'express';
import { CategoryHandler } from '../handlers/CategoryHandler';

const router = Router();
const handler = new CategoryHandler();

router.get('/', handler.getAllCategories);
router.get('/:id', handler.getCategoryById);
router.post('/', handler.createCategory);
router.put('/:id', handler.updateCategory);
router.delete('/:id', handler.deleteCategory);

export default router;
