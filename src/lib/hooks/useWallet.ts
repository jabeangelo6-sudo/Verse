"use client";
import { useState } from "react";

type Transaction = {
  id: string;
  type: "tip_received" | "tip_sent" | "membership" | "license_fee" | "subscription";
  amount: number;
  from?: string;
  to?: string;
  createdAt: Date;
  status: "confirmed" | "pending";
};

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: "t1", type: "tip_received", amount: 25.00, from: "alex_k", createdAt: new Date(Date.now() - 1000 * 60 * 5), status: "confirmed" },
  { id: "t2", type: "membership", amount: 9.99, from: "priya_m", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), status: "confirmed" },
  { id: "t3", type: "subscription", amount: 19.99, from: "lev_p", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5), status: "confirmed" },
  { id: "t4", type: "tip_received", amount: 50.00, from: "data_dao", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24), status: "confirmed" },
  { id: "t5", type: "license_fee", amount: 149.00, from: "TechCrunch", createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48), status: "confirmed" },
];

export function useWallet() {
  const [balance] = useState(1820.50);
  const [pendingBalance] = useState(34.20);
  const [transactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);

  const sendTip = async (to: string, amountUSD: number) => {
    await new Promise((r) => setTimeout(r, 1500));
    return { success: true };
  };

  const cashOut = async (amount: number) => {
    await new Promise((r) => setTimeout(r, 2000));
    return { success: true };
  };

  return { balance, pendingBalance, transactions, sendTip, cashOut };
}
