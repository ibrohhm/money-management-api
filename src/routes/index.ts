import { Router } from 'express';
import transactionRoutes from './transactionRoutes';
import categoryRoutes from './categoryRoutes';
import accountRoutes from './accountRoutes';
import accountGroupRoutes from './accountGroupRoutes';

const router = Router();

router.use('/transactions', transactionRoutes);
router.use('/categories', categoryRoutes);
router.use('/accounts', accountRoutes);
router.use('/account-groups', accountGroupRoutes);

export default router;
