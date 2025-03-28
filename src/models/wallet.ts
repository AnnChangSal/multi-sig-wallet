export interface Transaction {
    id: string;
    amount: number;
    fromWallet: string;
    toAddress: string;
    signatures: string[];
    approved: boolean;
}

export interface Wallet {
    id: string;
    owners: string[]; // public keys
    requiredSignatures: number;
    transactions: Transaction[];
}
