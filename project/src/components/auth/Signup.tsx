import React, { useState, FormEvent } from "react";
import { UserPlus, ArrowLeft, Mail, Lock, ShieldCheck } from "lucide-react";
import AuthLayout from "./AuthLayout";
import supabase from "../../lib/supabaseClient";
import toast from "react-hot-toast";

interface SignupForm {
  email: string;
  password: string;
  confirmPassword: string;
}

const Signup: React.FC = () => {
  const [formData, setFormData] = useState<SignupForm>({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isSigningUp, setIsSigningUp] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const { email, password, confirmPassword } = formData;

    // Validation
    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }
    if (!password) {
      toast.error("Password is required");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setIsSigningUp(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `http://localhost:5173/login`,
        },
      });

      if (error) {
        console.error("Signup error:", error);
        toast.error(error.message);
        return;
      }

      if (data.user) {
        console.log("Signup success:", data);
        toast.success("Signup successful!");

        // Reset form after successful signup
        setFormData({
          email: "",
          password: "",
          confirmPassword: "",
        });
      }
    } catch (err) {
      console.error("Unexpected signup error:", err);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSigningUp(false);
    }
  };

  return (
    <AuthLayout title="Create Access">
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
          <source src="/signup.mp4" type="video/mp4" />
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
            {/* Email */}
            <div className="relative">
              <label className="block text-sm font-medium mb-2 uppercase tracking-wider text-white/80">
                Identity Registration
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
                  disabled={isSigningUp}
                />
              </div>
            </div>

            {/* Password */}
            <div className="relative">
              <label className="block text-sm font-medium mb-2 uppercase tracking-wider text-white/80">
                Primary Security Key
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
                  placeholder="Create your password (min 6 characters)"
                  required
                  disabled={isSigningUp}
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <label className="block text-sm font-medium mb-2 uppercase tracking-wider text-white/80">
                Verify Security Key
              </label>
              <div className="relative">
                <ShieldCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="auth-input w-full pl-12 pr-4 py-4 rounded-none 
                    focus:ring-1 focus:ring-white/30 transition-all duration-300
                    text-white placeholder-white/30"
                  placeholder="Confirm your password"
                  required
                  disabled={isSigningUp}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 text-lg uppercase tracking-widest bg-white/5 border border-white/20
              hover:bg-white/10 hover:border-white/30 transition-all duration-300
              flex items-center justify-center gap-3 text-white
              disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSigningUp}
          >
            {isSigningUp ? (
              <>
                <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                Processing...
              </>
            ) : (
              <>
                Initialize Registration <UserPlus className="w-5 h-5" />
              </>
            )}
          </button>

          <div className="text-center pt-4">
            <a
              href="/login"
              className="inline-flex items-center justify-center gap-2 text-white/70 hover:text-white 
                transition-colors duration-300 uppercase tracking-wider text-sm"
            >
              <ArrowLeft className="w-4 h-4" /> Return to Access Point
            </a>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Signup;
