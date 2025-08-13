import React from "react";
import {
  Wallet as WalletIcon,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  ShoppingCart,
} from "lucide-react";
import { walletData } from "../data/wallet";

export const Wallet = () => {
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return <ArrowDownRight className="w-4 h-4 text-emerald-400" />;
      case "withdrawal":
        return <ArrowUpRight className="w-4 h-4 text-red-400" />;
      case "conversion":
        return <RefreshCw className="w-4 h-4 text-blue-400" />;
      case "purchase":
        return <ShoppingCart className="w-4 h-4 text-purple-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ARK Balance */}
        <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <WalletIcon className="w-6 h-6 text-purple-400" />
              <h3 className="text-lg text-zinc-200">ARK Balance</h3>
            </div>
            <span className="text-2xl font-bold text-zinc-200">
              {walletData.arkDollars.toLocaleString()} ARK
            </span>
          </div>
          <button className="w-full py-2 bg-purple-500/10 text-purple-400 rounded-lg hover:bg-purple-500/20 transition-colors">
            Convert ARK
          </button>
        </div>

        {/* Real Currency Balance */}
        <div className="bg-zinc-900 rounded-lg p-6 border border-zinc-800">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <WalletIcon className="w-6 h-6 text-emerald-400" />
              <h3 className="text-lg text-zinc-200">USD Balance</h3>
            </div>
            <span className="text-2xl font-bold text-zinc-200">
              ${walletData.realCurrency.toLocaleString()}
            </span>
          </div>
          <button className="w-full py-2 bg-emerald-500/10 text-emerald-400 rounded-lg hover:bg-emerald-500/20 transition-colors">
            Add Funds
          </button>
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-zinc-900 rounded-lg border border-zinc-800">
        <div className="px-6 py-4 border-b border-zinc-800">
          <h3 className="text-lg text-zinc-200">Recent Transactions</h3>
        </div>
        <div className="divide-y divide-zinc-800">
          {walletData.transactions.map((tx) => (
            <div
              key={tx.id}
              className="px-6 py-4 flex items-center justify-between"
            >
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-zinc-800 rounded-lg">
                  {getTransactionIcon(tx.type)}
                </div>
                <div>
                  <p className="text-zinc-200">{tx.description}</p>
                  <p className="text-sm text-zinc-400">
                    {new Date(tx.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-zinc-200">
                  {tx.currency === "ARK"
                    ? `${tx.amount.toLocaleString()} ARK`
                    : `$${tx.amount.toLocaleString()}`}
                </p>
                <p
                  className={`text-sm ${
                    tx.status === "completed"
                      ? "text-emerald-400"
                      : tx.status === "pending"
                      ? "text-amber-400"
                      : "text-red-400"
                  }`}
                >
                  {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
