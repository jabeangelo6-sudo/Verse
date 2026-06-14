"use client";
import { useState } from "react";

type Transaction = {
  id: string;
  type: "tip_received" | "tip_sent" | "token_sale" | "nft_sale" | "subscription";
  amount: number;
  from?: string;
  to?: string;
  createdAt: Date;
  status: "confirmed" | "pending";
};

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: "t1", type: "tip_received", amount: 25.00, from: "pixel_dao", createdAt: new Date(Date.now() - 1000 * 60 * 5), status: "confirmed" },
  { id: "t2", type: "token_sale", amount: 8.40, from: "nft_nova", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), status: "confirmed" },
  { id: "t3", type: "subscription", amount: 9.99, from: "defi_dave", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5), status: "confirmed" },
  { id: "t4", type: "tip_received", amount: 50.00, from: "zk_zara", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), status: "confirmed" },
  { id: "t5", type: "nft_sale", amount: 420.00, from: "solana_sage", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48), status: "confirmed" },
];

export function useWallet() {
  const [balance] = useState(1820.50);
  const [ethBalance] = useState(0.742);
  const [pendingBalance] = useState(34.20);
  const [transactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);

  const sendTip = async (to: string, amountUSD: number) => {
    await new Promise((r) => setTimeout(r, 1500));
    return { success: true, txHash: "0x" + Math.random().toString(16).slice(2) };
  };

  const cashOut = async (amount: number) => {
    await new Promise((r) => setTimeout(r, 2000));
    return { success: true };
  };

  const buyTokens = async (creatorId: string, amount: number) => {
    await new Promise((r) => setTimeout(r, 1500));
    return { success: true, txHash: "0x" + Math.random().toString(16).slice(2) };
  };

  return { balance, ethBalance, pendingBalance, transactions, sendTip, cashOut, buyTokens };
}
