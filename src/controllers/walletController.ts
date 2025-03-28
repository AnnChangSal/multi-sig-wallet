import { Request, Response, NextFunction } from 'express';
import { Wallet, Transaction } from '../models/wallet';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

// In-memory storage for demonstration purposes
const wallets: Record<string, Wallet> = {};
const transactions: Record<string, Transaction> = {};

export const createWallet = (req: Request, res: Response, next: NextFunction): Response => {
    const { owners, requiredSignatures } = req.body;
    if (!owners || !Array.isArray(owners) || owners.length === 0 || !requiredSignatures) {
    return res.status(400).json({ error: 'Invalid input: owners and requiredSignatures are required.' });
    }
    const id = uuidv4();
    const wallet: Wallet = { id, owners, requiredSignatures, transactions: [] };
    wallets[id] = wallet;
    return res.status(201).json(wallet);
};

export const createTransaction = (req: Request, res: Response, next: NextFunction): Response => {
    const { walletId, amount, toAddress } = req.body;
    if (!walletId || !amount || !toAddress) {
    return res.status(400).json({ error: 'Invalid input: walletId, amount, and toAddress are required.' });
    }
    if (!wallets[walletId]) {
    return res.status(404).json({ error: 'Wallet not found' });
    }
    const id = uuidv4();
    const transaction: Transaction = { id, amount, fromWallet: walletId, toAddress, signatures: [], approved: false };
    transactions[id] = transaction;
    wallets[walletId].transactions.push(transaction);
    return res.status(201).json(transaction);
};

export const approveTransaction = (req: Request, res: Response, next: NextFunction): Response => {
    const { id } = req.params;
    const { ownerKey } = req.body;
    if (!ownerKey) {
    return res.status(400).json({ error: 'Invalid input: ownerKey is required.' });
    }
    const transaction = transactions[id];
    if (!transaction) {
        return res.status(404).json({ error: 'Transaction not found' });
    }
    const wallet = wallets[transaction.fromWallet];
    if (!wallet.owners.includes(ownerKey)) {
        return res.status(403).json({ error: 'Unauthorized signature' });
    }
  // Simulate a digital signature using a hash
    const signature = crypto.createHash('sha256').update(id + ownerKey).digest('hex');
    if (!transaction.signatures.includes(signature)) {
        transaction.signatures.push(signature);
    }
    if (transaction.signatures.length >= wallet.requiredSignatures) {
        transaction.approved = true;
    }
    return res.json(transaction);
};

export const getWallet = (req: Request, res: Response, next: NextFunction): Response => {
    const { id } = req.params;
    const wallet = wallets[id];
    if (!wallet) {
        return res.status(404).json({ error: 'Wallet not found' });
    }
    return res.json(wallet);
};
