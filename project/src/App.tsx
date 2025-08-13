import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./context/ThemeContext";
import Layout from "./components/Layout";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Dashboard from "./components/dashboard/Dashboard";
import Contact from "./components/sections/Contact";
import Social from "./components/socials/Social";
import Edtech from "./components/edtech/Edtech";
import "./index.css";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter basename="/">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/contact" element={<Contact />} />
            <Route path="/social/*" element={<Social />} />
            <Route path="/socials" element={<Social />} />
            <Route path="/socials/*" element={<Social />} />
            <Route path="/edtech/*" element={<Edtech />} />
            <Route path="/admin" element={<Social />} />
            <Route path="/admin/*" element={<Social />} />

            <Route path="/" element={<Layout />} />
          </Routes>

          {/* Toast notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: "rgba(0, 0, 0, 0.8)",
                color: "#ffffff",
                border: "1px solid rgba(255, 255, 255, 0.2)",
                borderRadius: "8px",
                fontFamily: "monospace",
              },
              success: {
                iconTheme: {
                  primary: "#00ff41",
                  secondary: "#000000",
                },
              },
              error: {
                iconTheme: {
                  primary: "#ff4444",
                  secondary: "#000000",
                },
              },
            }}
          />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
