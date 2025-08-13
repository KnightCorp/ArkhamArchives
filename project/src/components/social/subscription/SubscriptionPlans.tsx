import React from "react";
import { useTokenStore } from "../stores/tokenStore";
import { Coins, Zap, Crown } from "lucide-react";

const plans = [
  {
    id: "basic",
    name: "Basic",
    price: 2,
    tokens: 100,
    features: [
      "Basic AI responses",
      "Standard chat features",
      "Public servers access",
      "10 Deepface tokens",
      "20 Text-to-Video tokens",
      "15 Text-to-Podcast tokens",
    ],
  },
  {
    id: "plus",
    name: "Plus",
    price: 5,
    tokens: 300,
    features: [
      "Advanced AI capabilities",
      "Priority support",
      "Private servers access",
      "Custom themes",
      "30 Deepface tokens",
      "50 Text-to-Video tokens",
      "45 Text-to-Podcast tokens",
      "20 Text-to-Mindmap tokens",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: 10,
    tokens: 1000,
    features: [
      "Premium AI features",
      "24/7 priority support",
      "Unlimited server access",
      "Custom branding",
      "API access",
      "Unlimited Deepface tokens",
      "Unlimited Text-to-Video tokens",
      "Unlimited Text-to-Podcast tokens",
      "Unlimited Text-to-Mindmap tokens",
      "Unlimited Text-to-Image tokens",
      "Unlimited Text-to-Music tokens",
    ],
  },
];

export const SubscriptionPlans = () => {
  const { tokens, addTokens } = useTokenStore();

  const handleSubscribe = (planId: string) => {
    // In a real app, this would integrate with a payment processor
    console.log(`Subscribing to plan: ${planId}`);
  };

  return (
    <div className="space-y-8">
      {/* Token Usage */}
      <div className="bg-black rounded-lg p-6 border border-white/10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Coins className="w-6 h-6 text-white" />
            <h2 className="text-xl text-white">Your Tokens</h2>
          </div>
          <span className="text-2xl font-bold text-white">{tokens}</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full">
          <div
            className="h-full bg-white rounded-full transition-all"
            style={{ width: `${(tokens / 1000) * 100}%` }}
          />
        </div>
      </div>

      {/* Subscription Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="bg-black rounded-lg p-6 border border-white/10 hover:border-white/20 transition-all"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl text-white">{plan.name}</h3>
              <div className="flex items-center space-x-1">
                <span className="text-2xl font-bold text-white">
                  ${plan.price}
                </span>
                <span className="text-white/40">/mo</span>
              </div>
            </div>

            <div className="flex items-center space-x-2 mb-6">
              <Zap className="w-5 h-5 text-white" />
              <span className="text-white">{plan.tokens} tokens/month</span>
            </div>

            <ul className="space-y-3 mb-6">
              {plan.features.map((feature, index) => (
                <li
                  key={index}
                  className="flex items-center space-x-2 text-white/60"
                >
                  <Crown className="w-4 h-4 text-white" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSubscribe(plan.id)}
              className="w-full py-2 bg-white text-black rounded-lg hover:bg-white/90 transition-colors"
            >
              Subscribe
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
