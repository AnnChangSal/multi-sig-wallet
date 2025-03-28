import request from 'supertest';
import express, { Application } from 'express';
import walletRoutes from '../src/routes/walletRoutes';

const app: Application = express();
app.use(express.json());
app.use('/wallet', walletRoutes);

describe('Multi-Signature Wallet Simulator API', () => {
  let walletId: string;
  let transactionId: string;
  const owners = ['owner1', 'owner2', 'owner3'];
  const requiredSignatures = 2;

  it('should create a new wallet', async () => {
    const res = await request(app)
      .post('/wallet')
      .send({ owners, requiredSignatures });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    walletId = res.body.id;
  });

  it('should create a new transaction', async () => {
    const res = await request(app)
      .post('/wallet/transaction')
      .send({ walletId, amount: 100, toAddress: 'recipientAddress' });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('id');
    transactionId = res.body.id;
  });

  it('should approve a transaction', async () => {
    // First signature from owner1
    const res1 = await request(app)
      .put(`/wallet/transaction/${transactionId}/approve`)
      .send({ ownerKey: 'owner1' });
    expect(res1.statusCode).toEqual(200);
    expect(res1.body.signatures.length).toBe(1);
    expect(res1.body.approved).toBe(false);

    // Second signature from owner2 should approve the transaction
    const res2 = await request(app)
      .put(`/wallet/transaction/${transactionId}/approve`)
      .send({ ownerKey: 'owner2' });
    expect(res2.statusCode).toEqual(200);
    expect(res2.body.signatures.length).toBe(2);
    expect(res2.body.approved).toBe(true);
  });
});
