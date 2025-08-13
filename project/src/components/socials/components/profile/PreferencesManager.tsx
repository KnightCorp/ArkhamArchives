import React, { useState } from "react";
import { PreferenceSection } from "./PreferenceSection";
import { preferenceCategories } from "../../data/preferences";
import type { UserPreferences } from "../../lib/profileQueries";
import { Loader2 } from "lucide-react";

interface PreferencesManagerProps {
  preferences: UserPreferences | null;
  onPreferencesUpdate: (updates: Partial<UserPreferences>) => Promise<void>;
  loading: boolean;
}

// Define the expected preference categories type
type PreferenceCategoryKey = keyof typeof preferenceCategories;

export const PreferencesManager: React.FC<PreferencesManagerProps> = ({
  preferences,
  onPreferencesUpdate,
  loading,
}) => {
  const [localPreferences, setLocalPreferences] = useState({
    interests: preferences?.interests || [],
    values: preferences?.values || [],
    aesthetics: preferences?.aesthetics || [],
    genres: preferences?.genres || [],
    moods: preferences?.moods || [], // Add the new moods category
  });
  const [saving, setSaving] = useState(false);

  // Update local preferences when props change
  React.useEffect(() => {
    if (preferences) {
      setLocalPreferences({
        interests: preferences.interests || [],
        values: preferences.values || [],
        aesthetics: preferences.aesthetics || [],
        genres: preferences.genres || [],
        moods: preferences.moods || [],
      });
    }
  }, [preferences]);

  const handlePreferenceChange =
    (category: keyof typeof localPreferences) => (keywords: string[]) => {
      setLocalPreferences((prev) => ({
        ...prev,
        [category]: keywords,
      }));
    };

  const handleSave = async () => {
    try {
      setSaving(true);
      await onPreferencesUpdate(localPreferences);
    } catch (error) {
      console.error("Error saving preferences:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {Object.entries(preferenceCategories).map(([key, category]) => {
        // Ensure the key exists in localPreferences
        const categoryKey = key as PreferenceCategoryKey;
        const selectedKeywords = localPreferences[categoryKey] || [];

        return (
          <PreferenceSection
            key={key}
            title={category.title}
            description={category.description}
            suggestions={category.suggestions || []}
            selectedKeywords={selectedKeywords}
            onKeywordsChange={handlePreferenceChange(categoryKey)}
          />
        );
      })}

      <div className="flex items-center justify-between">
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-6 py-3 bg-white text-black rounded-lg hover:bg-white/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          <span>{saving ? "Saving..." : "Save Preferences"}</span>
        </button>

        {preferences && (
          <div className="text-sm text-zinc-400">
            Last updated:{" "}
            {new Date(preferences.updated_at).toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
  );
};
