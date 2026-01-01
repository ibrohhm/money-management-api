import { Router } from 'express';
import transactionRoutes from './transactionRoutes';
import categoryRoutes from './categoryRoutes';
import accountRoutes from './accountRoutes';

const router = Router();

router.use('/transactions', transactionRoutes);
router.use('/categories', categoryRoutes);
router.use('/accounts', accountRoutes);

export default router;
