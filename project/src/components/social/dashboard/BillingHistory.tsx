import React from "react";
import { billingHistory } from "../data/subscriptions";

export const BillingHistory = () => (
  <div className="bg-zinc-900 rounded-lg border border-zinc-800">
    <div className="px-6 py-4 border-b border-zinc-800">
      <h2 className="text-lg text-zinc-200">Billing History</h2>
    </div>
    <div className="divide-y divide-zinc-800">
      {billingHistory.map((bill) => (
        <div
          key={bill.id}
          className="px-6 py-4 flex items-center justify-between"
        >
          <div>
            <p className="text-zinc-200">{bill.description}</p>
            <p className="text-sm text-zinc-400">
              {new Date(bill.date).toLocaleDateString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-zinc-200">${bill.amount}</p>
            <p
              className={`text-sm ${
                bill.status === "paid"
                  ? "text-emerald-400"
                  : bill.status === "pending"
                  ? "text-amber-400"
                  : "text-red-400"
              }`}
            >
              {bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
);
