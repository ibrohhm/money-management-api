import { Router } from 'express';
import { AccountGroupHandler } from '../handlers/AccountGroupHandler';

const router = Router();
const handler = new AccountGroupHandler();

router.get('/', handler.getAllAccountGroups);
router.get('/:id', handler.getAccountGroupById);
router.post('/', handler.createAccountGroup);
router.put('/:id', handler.updateAccountGroup);
router.delete('/:id', handler.deleteAccountGroup);

export default router;
