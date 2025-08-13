import React, { useState, FormEvent } from "react";
import { LogIn, ArrowRight, Mail, Lock } from "lucide-react";
import AuthLayout from "./AuthLayout";
import supabase from "../../lib/supabaseClient";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    }
    if (!formData.password) {
      toast.error("Password is required");
      return;
    }

    setIsLoggingIn(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email.trim(),
        password: formData.password,
      });

      if (error) {
        console.error("Login error:", error);
        toast.error(error.message);
        return;
      }

      if (data.user) {
        toast.success("Login successful!");
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <AuthLayout title="Access Archives">
      <div className="video-background">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="video-bg"
          onError={(e) => console.error("Video failed to load:", e)}
          onCanPlay={() => console.log("Video can play")}
          onLoadedData={() => console.log("Video loaded")}
        >
          <source src="/login.mp4" type="video/mp4" />
          <p>Your browser doesn't support HTML video.</p>
        </video>
      </div>

      <div className="video-overlay"></div>

      <div
        className="auth-container"
        style={{ position: "relative", zIndex: 20 }}
      >
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            {/* Email Input */}
            <div className="relative">
              <label className="block text-sm font-medium mb-2 uppercase tracking-wider text-white/80">
                Identity Verification
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="auth-input w-full pl-12 pr-4 py-4 rounded-none 
                    focus:ring-1 focus:ring-white/30 transition-all duration-300
                    text-white placeholder-white/30"
                  placeholder="Enter your email"
                  required
                  disabled={isLoggingIn}
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="relative">
              <label className="block text-sm font-medium mb-2 uppercase tracking-wider text-white/80">
                Security Protocol
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="auth-input w-full pl-12 pr-4 py-4 rounded-none 
                    focus:ring-1 focus:ring-white/30 transition-all duration-300
                    text-white placeholder-white/30"
                  placeholder="Enter your password"
                  required
                  disabled={isLoggingIn}
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-4 text-lg uppercase tracking-widest bg-white/5 border border-white/20
              hover:bg-white/10 hover:border-white/30 transition-all duration-300
              flex items-center justify-center gap-3 text-white
              disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoggingIn}
          >
            {isLoggingIn ? (
              <>
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                Processing...
              </>
            ) : (
              <>
                Initialize Access <LogIn className="w-5 h-5" />
              </>
            )}
          </button>

          <div className="text-center pt-4">
            <a
              href="/signup"
              className="inline-flex items-center justify-center gap-2 text-white/70 hover:text-white 
                transition-colors duration-300 uppercase tracking-wider text-sm"
            >
              Request New Access <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;
