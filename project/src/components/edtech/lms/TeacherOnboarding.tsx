import React, { useState } from "react";
import { X, Link } from "lucide-react";

interface TeacherOnboardingProps {
  onSubmit: (data: TeacherFormData) => void;
  onCancel: () => void;
}

interface TeacherFormData {
  name: string;
  bio: string;
  professionalBackground: string;
  tags: string[];
  expertise: string;
  profilePhoto?: File;
  linkedinUrl?: string;
  youtubeUrl?: string;
  instagramUrl?: string;
}

const TeacherOnboarding: React.FC<TeacherOnboardingProps> = ({
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState<TeacherFormData>({
    name: "",
    bio: "",
    professionalBackground: "",
    tags: [],
    expertise: "",
    linkedinUrl: "",
    youtubeUrl: "",
    instagramUrl: "",
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const availableTags = [
    "AI",
    "Machine Learning",
    "Deep Learning",
    "React",
    "JavaScript",
    "Python",
    "Data Science",
    "Web Development",
    "Mobile Development",
    "Blockchain",
    "Cybersecurity",
    "Cloud Computing",
    "DevOps",
    "Product Management",
    "UI/UX Design",
    "Digital Marketing",
    "Finance",
    "Business Strategy",
  ];

  const handleInputChange = (field: keyof TeacherFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleTagToggle = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Only submit if we're on the last step
    if (currentStep === totalSteps) {
      onSubmit(formData);
    }
  };

  const handleNextStep = () => {
    if (canProceed(currentStep) && currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const canProceed = (step: number) => {
    switch (step) {
      case 1:
        return formData.name && formData.bio && formData.professionalBackground;
      case 2:
        return formData.tags.length > 0 && formData.expertise;
      case 3:
        return true; // Social links are optional
      default:
        return false;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90">
      <div className="bg-black border border-white/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="border-b border-white/10 p-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-white font-bold text-lg">
                TEACHER_ONBOARDING.EXE
              </h2>
              <p className="text-white/60 text-sm">
                Step {currentStep} of {totalSteps}
              </p>
            </div>
            <button
              onClick={onCancel}
              className="text-white/80 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-4 w-full bg-white/10 h-1">
            <div
              className="bg-white h-1 transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-white font-bold mb-4">BASIC_INFORMATION</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-white/80 text-sm mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      className="w-full bg-black/50 border border-white/20 text-white px-3 py-2 focus:border-white focus:outline-none"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm mb-2">
                      Bio *
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      className="w-full bg-black/50 border border-white/20 text-white px-3 py-2 h-20 focus:border-white focus:outline-none resize-none"
                      placeholder="Brief description about yourself"
                    />
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm mb-2">
                      Professional Background *
                    </label>
                    <textarea
                      value={formData.professionalBackground}
                      onChange={(e) =>
                        handleInputChange(
                          "professionalBackground",
                          e.target.value
                        )
                      }
                      className="w-full bg-black/50 border border-white/20 text-white px-3 py-2 h-24 focus:border-white focus:outline-none resize-none"
                      placeholder="Your education, work experience, achievements..."
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Expertise & Tags */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-white font-bold mb-4">
                  EXPERTISE_&_SPECIALIZATION
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-white/80 text-sm mb-2">
                      Areas of Expertise *
                    </label>
                    <textarea
                      value={formData.expertise}
                      onChange={(e) =>
                        handleInputChange("expertise", e.target.value)
                      }
                      className="w-full bg-black/50 border border-white/20 text-white px-3 py-2 h-20 focus:border-white focus:outline-none resize-none"
                      placeholder="Describe what you specialize in and what you can teach..."
                    />
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm mb-2">
                      Tags * (Select at least one)
                    </label>
                    <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                      {availableTags.map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => handleTagToggle(tag)}
                          className={`px-3 py-1 text-xs border transition-colors ${
                            formData.tags.includes(tag)
                              ? "bg-white/20 text-white border-white/30"
                              : "text-white/80 border-white/20 hover:border-white/50"
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                    <p className="text-white/60 text-xs mt-2">
                      Selected: {formData.tags.join(", ") || "None"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Social Links */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-white font-bold mb-4">
                  SOCIAL_LINKS (Optional)
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-white/80 text-sm mb-2">
                      <Link className="w-4 h-4 inline mr-2" />
                      LinkedIn Profile
                    </label>
                    <input
                      type="url"
                      value={formData.linkedinUrl}
                      onChange={(e) =>
                        handleInputChange("linkedinUrl", e.target.value)
                      }
                      className="w-full bg-black/50 border border-white/20 text-white px-3 py-2 focus:border-white focus:outline-none"
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm mb-2">
                      <Link className="w-4 h-4 inline mr-2" />
                      YouTube Channel
                    </label>
                    <input
                      type="url"
                      value={formData.youtubeUrl}
                      onChange={(e) =>
                        handleInputChange("youtubeUrl", e.target.value)
                      }
                      className="w-full bg-black/50 border border-white/20 text-white px-3 py-2 focus:border-white focus:outline-none"
                      placeholder="https://youtube.com/c/yourchannel"
                    />
                  </div>

                  <div>
                    <label className="block text-white/80 text-sm mb-2">
                      <Link className="w-4 h-4 inline mr-2" />
                      Instagram Profile
                    </label>
                    <input
                      type="url"
                      value={formData.instagramUrl}
                      onChange={(e) =>
                        handleInputChange("instagramUrl", e.target.value)
                      }
                      className="w-full bg-black/50 border border-white/20 text-white px-3 py-2 focus:border-white focus:outline-none"
                      placeholder="https://instagram.com/yourprofile"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-white/10">
            <button
              type="button"
              onClick={handlePreviousStep}
              className={`px-6 py-2 border ${
                currentStep === 1
                  ? "text-white/40 border-white/10 cursor-not-allowed"
                  : "text-white border-white/20 hover:border-white/50"
              }`}
              disabled={currentStep === 1}
            >
              [BACK]
            </button>

            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={handleNextStep}
                className={`px-6 py-2 border ${
                  canProceed(currentStep)
                    ? "text-white border-white/30 bg-white/10 hover:bg-white/20"
                    : "text-white/40 border-white/10 cursor-not-allowed"
                }`}
                disabled={!canProceed(currentStep)}
              >
                [NEXT]
              </button>
            ) : (
              <button
                type="submit"
                className="px-6 py-2 border text-white border-white/30 bg-white/10 hover:bg-white/20"
              >
                [SUBMIT_APPLICATION]
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeacherOnboarding;
