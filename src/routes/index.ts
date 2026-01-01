import { Router } from 'express';
import transactionRoutes from './transactionRoutes';
import categoryRoutes from './categoryRoutes';

const router = Router();

router.use('/transactions', transactionRoutes);
router.use('/categories', categoryRoutes);

export default router;
