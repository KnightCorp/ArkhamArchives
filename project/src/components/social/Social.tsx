import React from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import Explore from "./pages/Explore";
import Store from "./pages/Store";
import Timeline from "./pages/Timeline";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Reels from "./pages/Reels";
import Messenger from "./pages/Messenger";
import Feed from "./pages/Feed";
import Subscription from "./pages/Subscription";
import SocialLayout from "./SocialLayout";
import Referral from "./pages/Referral";

const Social: React.FC = () => {
  return (
    <Routes>
      <Route element={<SocialLayout />}>
        <Route index element={<Feed />} />
        <Route path="explore" element={<Explore />} />
        <Route path="feed" element={<Feed />} />
        <Route path="reels" element={<Reels />} />
        <Route path="store" element={<Store />} />
        <Route path="timeline" element={<Timeline />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
        {/* <Route path="messenger" element={<Messenger />} /> */}
        <Route path="subscription" element={<Subscription />} />
        <Route path="referrals" element={<Referral />} />
      </Route>
    </Routes>
  );
};

export default Social;
