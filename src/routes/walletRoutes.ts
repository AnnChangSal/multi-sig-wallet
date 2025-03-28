import { Router, RequestHandler } from 'express';
import { createWallet, createTransaction, approveTransaction, getWallet } from '../controllers/walletController';

const router = Router();

router.post('/', createWallet as unknown as RequestHandler);
router.post('/transaction', createTransaction as unknown as RequestHandler);
router.put('/transaction/:id/approve', approveTransaction as unknown as RequestHandler);
router.get('/:id', getWallet as unknown as RequestHandler);

export default router;
