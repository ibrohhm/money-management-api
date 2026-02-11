import { Router } from 'express';
import { TransactionHandler } from '../handlers/TransactionHandler';

const router = Router();
const handler = new TransactionHandler();

router.get('/', handler.getAllTransactionGroups);

export default router;
