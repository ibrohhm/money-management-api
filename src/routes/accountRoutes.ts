import { Router } from 'express';
import { AccountHandler } from '../handlers/AccountHandler';

const router = Router();
const handler = new AccountHandler();

router.get('/', handler.getAllAccounts);
router.get('/:id', handler.getAccountById);
router.post('/', handler.createAccount);
router.put('/:id', handler.updateAccount);
router.delete('/:id', handler.deleteAccount);

export default router;
