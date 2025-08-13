import React, { useState } from "react";
import { Tabs } from "../ui/Tabs";
import { AdCampaigns } from "../dashboard/AdCampaigns";
import { Insights } from "../dashboard/Insights";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("campaigns");

  const tabs = [
    { id: "campaigns", label: "Ad Campaigns" },
    { id: "insights", label: "Insights" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "campaigns":
        return <AdCampaigns />;
      case "insights":
        return <Insights />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl detective-text text-zinc-200 mb-8">Dashboard</h1>
      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      <div className="mt-8">{renderContent()}</div>
    </div>
  );
};

export default Dashboard;
