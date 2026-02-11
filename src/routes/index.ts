import { Router } from 'express';
import transactionGroupRoutes from './transactionGroupRoutes';
import transactionRoutes from './transactionRoutes';
import categoryRoutes from './categoryRoutes';
import accountRoutes from './accountRoutes';
import accountGroupRoutes from './accountGroupRoutes';

const router = Router();

router.use('/transaction-groups', transactionGroupRoutes);
router.use('/transactions', transactionRoutes);
router.use('/categories', categoryRoutes);
router.use('/accounts', accountRoutes);
router.use('/account-groups', accountGroupRoutes);

export default router;
