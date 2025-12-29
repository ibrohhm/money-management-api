import { Router } from 'express';
import { TransactionHandler } from '../handlers/TransactionHandler';

const router = Router();
const handler = new TransactionHandler();

router.get('/', handler.getAllTransactions);
router.get('/:id', handler.getTransactionById);
router.post('/', handler.createTransaction);
router.put('/:id', handler.updateTransaction);
router.delete('/:id', handler.deleteTransaction);

export default router;
