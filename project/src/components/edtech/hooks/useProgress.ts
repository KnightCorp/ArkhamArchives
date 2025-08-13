// Create this as a new file: hooks/useProgressSync.ts
import { useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import useProgressStore from "../../../store/useProgressStore";

export const useProgressSync = () => {
  const { user } = useAuth();
  const syncProgressToSupabase = useProgressStore(
    (state) => state.syncProgressToSupabase
  );
  const lastSyncTime = useProgressStore((state) => state.lastSyncTime);

  // Auto-sync every 5 minutes
  useEffect(() => {
    if (!user?.id) return;

    const interval = setInterval(() => {
      const now = new Date();
      const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

      if (!lastSyncTime || lastSyncTime < fiveMinutesAgo) {
        syncProgressToSupabase(user.id);
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [user?.id, syncProgressToSupabase, lastSyncTime]);

  // Sync on window focus (when user comes back to tab)
  useEffect(() => {
    if (!user?.id) return;

    const handleFocus = () => {
      syncProgressToSupabase(user.id);
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [user?.id, syncProgressToSupabase]);

  // Sync before page unload
  useEffect(() => {
    if (!user?.id) return;

    const handleBeforeUnload = () => {
      // Use sendBeacon for reliable sync on page unload
      const state = useProgressStore.getState();
      navigator.sendBeacon(
        "/api/sync-progress",
        JSON.stringify({
          userId: user.id,
          xp: state.xp,
          totalXP: state.totalXP,
          level: state.level,
          progress: state.progress,
        })
      );
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [user?.id]);
};
