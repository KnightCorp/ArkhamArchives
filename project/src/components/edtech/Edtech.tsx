import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import TechClub from "./pages/TechClub";
import ExamPrep from "./pages/ExamPrep";
import Library from "./pages/Library";
import Archives from "./pages/Archives";
import AdminDashboard from "./pages/AdminDashboard";
import LMSMentors from "./lms/LMSMentors";
import MentorsPage from "./lms/MentorsPage";
import ClassesPage from "./lms/ClassesPage";
import "./styles/fonts.css";
import "./styles/effects.css";
import "./Edtech.css";

const Edtech: React.FC = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="library" element={<Library />} />
        <Route path="archives" element={<Archives />} />
        <Route path="tech-club" element={<TechClub />} />
        <Route path="exam-prep" element={<ExamPrep />} />
        <Route path="admin" element={<AdminDashboard />} />
        <Route path="lms" element={<LMSMentors />} />
        <Route path="mentors" element={<MentorsPage />} />
        <Route path="classes" element={<ClassesPage />} />
      </Route>
    </Routes>
  );
};

export default Edtech;
