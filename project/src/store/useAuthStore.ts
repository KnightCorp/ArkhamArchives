import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io, Socket } from "socket.io-client";

const BASE_URL = "https://arkham.onrender.com/api";

// Token management functions
const saveTokenToStorage = (token: any) => {
  if (token) {
    localStorage.setItem("authToken", token);
    console.log("Token saved to localStorage");
  } else {
    localStorage.removeItem("authToken");
    console.log("Token removed from localStorage");
  }
};

const getTokenFromStorage = () => {
  const token = localStorage.getItem("authToken");
  console.log(
    "Retrieved token from localStorage:",
    token ? "Token exists" : "No token"
  );
  return token;
};

interface User {
  _id: string;
  email?: string;
  profilePic?: string;
  isAdmin?: boolean;
}

interface AuthState {
  authUser: User | null;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isUpdatingProfile: boolean;
  isCheckingAuth: boolean;
  onlineUsers: string[];
  socket: Socket | null;
  checkAuth: () => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  login: (data: LoginData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: UpdateProfileData) => Promise<void>;
  connectSocket: () => void;
  disconnectSocket: () => void;
  fetchUserProfile: () => Promise<void>;
}

interface SignupData {
  email: string;
  password: string;
  confirmPassword: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface UpdateProfileData {
  email?: string;
  password?: string;
  profilePic?: string;
}

const useAuthStore = create<AuthState>((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      console.log("Checking authentication status...");

      // Check if we have a token first
      const token = getTokenFromStorage();
      if (!token) {
        console.log("No token found in storage");
        set({ authUser: null });
        return;
      }

      const res = await axiosInstance.get("/auth/check");
      console.log("Auth check response:", res.data);

      const userData = {
        _id: res.data._id,
        email: res.data.email,
        profilePic: res.data.profilePic,
        isAdmin: Boolean(res.data.isAdmin),
      };

      set({ authUser: userData });
      console.log("Auth check successful, user data:", userData);
      get().connectSocket();
    } catch (error) {
      console.log("Auth check failed:", error);
      // Clear invalid token
      saveTokenToStorage(null);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      if (data.password !== data.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      const { confirmPassword, ...signupData } = data;
      const res = await axiosInstance.post("/auth/signup", signupData);

      // Save token if provided
      if (res.data.token) {
        saveTokenToStorage(res.data.token);
      }

      set({ authUser: res.data });
      toast.success("Access created successfully");
      get().connectSocket();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || error.message || "Registration failed"
      );
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      console.log("Attempting login for:", data.email);

      const res = await axiosInstance.post("/auth/login", data);
      console.log("Login response received, has token:", !!res.data.token);

      // Save token to localStorage
      if (res.data.token) {
        saveTokenToStorage(res.data.token);
      }

      const userData = {
        _id: res.data._id || res.data.id,
        email: res.data.email,
        profilePic: res.data.profilePic,
        isAdmin: Boolean(res.data.isAdmin),
      };

      set({ authUser: userData });
      toast.success(res.data.message || "Access granted successfully");

      get().connectSocket();

      // Navigate to dashboard
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 500);
    } catch (error: any) {
      console.error(
        "Login error details:",
        error.response?.data || error.message
      );
      toast.error(
        error.response?.data?.message || "Access verification failed"
      );
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      saveTokenToStorage(null);
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
      window.location.href = "/";
    } catch (error: any) {
      // Even if the server request fails, clear local data
      saveTokenToStorage(null);
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
      window.location.href = "/";
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error: any) {
      console.log("error in update profile:", error);
      toast.error(error.response?.data?.message || "Profile update failed");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    console.log("Connecting socket for user:", authUser._id);

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    socket.on("connect", () => {
      console.log("Socket connected successfully");
    });

    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    socket.connect();
    set({ socket });

    socket.on("getOnlineUsers", (userIds: string[]) => {
      console.log("Online users received:", userIds);
      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket?.connected) socket.disconnect();
  },

  fetchUserProfile: async () => {
    const token = getTokenFromStorage();
    if (!token) return;
    try {
      // Replace with your actual API endpoint for user profile
      const res = await axiosInstance.get("/user/profile");
      set({ authUser: { ...get().authUser, ...res.data } });
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    }
  },
}));

export default useAuthStore;
