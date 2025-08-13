import React from "react";
import SubscriptionPlans from "../components/subscription/SubscriptionPlans";

const Subscription = () => {
  return (
    <div className="max-w-7xl mx-auto p-8">
      <h1 className="text-3xl text-zinc-200 mb-8">Subscription Plans</h1>
      <SubscriptionPlans />
    </div>
  );
};

export default Subscription;
