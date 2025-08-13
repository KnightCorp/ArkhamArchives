import React from "react";
import { X, FileText, Shield, Mail } from "lucide-react";

interface LegalPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSectionSelect: (section: "terms" | "privacy" | "contact") => void;
}

const LegalPopup: React.FC<LegalPopupProps> = ({
  isOpen,
  onClose,
  onSectionSelect,
}) => {
  if (!isOpen) return null;

  const legalOptions = [
    {
      id: "terms" as const,
      icon: FileText,
      title: "Terms & Conditions",
      description: "View our terms of service and usage policies",
    },
    {
      id: "privacy" as const,
      icon: Shield,
      title: "Privacy Policy",
      description: "Learn how we protect and handle your data",
    },
    {
      id: "contact" as const,
      icon: Mail,
      title: "Contact Us",
      description: "Get in touch with our support team",
    },
  ];

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Popup */}
      <div className="fixed left-16 top-1/2 -translate-y-1/2 z-50 w-80">
        <div className="sidebar-glass rounded-xl border border-white/10 p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-white font-semibold text-lg">
              Legal & Contact
            </h3>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4 text-white/70 hover:text-white" />
            </button>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {legalOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => {
                  onSectionSelect(option.id);
                  onClose();
                }}
                className="w-full p-4 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#00a2ff]/30 transition-all group text-left"
              >
                <div className="flex items-start space-x-3">
                  <option.icon className="w-5 h-5 text-white/70 group-hover:text-[#00a2ff] transition-colors mt-0.5" />
                  <div>
                    <h4 className="text-white font-medium mb-1 group-hover:text-[#00a2ff] transition-colors">
                      {option.title}
                    </h4>
                    <p className="text-white/60 text-sm">
                      {option.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default LegalPopup;
