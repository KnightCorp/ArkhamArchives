import React, { useEffect, useRef } from "react";
import {
  ArrowRight,
  LogIn,
  Download,
  Lock,
  Youtube,
  Linkedin,
  Instagram,
} from "lucide-react";

const Hero: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fade-in");
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const handleExplore = () => {
    window.location.href = "/login";
  };

  return (
    <div className="section-container bg-black" id="hero" ref={sectionRef}>
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
          <source src="/home.mp4" type="video/mp4" />
          <p>Your browser doesn't support HTML video.</p>
        </video>
      </div>
      <div className="video-overlay"></div>
      {/* <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black z-10"></div>
        <img
          src="/bg_hero.jpg"
          alt="Background"
          className="w-full h-full object-cover object-center filter grayscale brightness-75 contrast-125"
        />
      </div> */}

      <button className="auth-button">
        Enter the Archives <LogIn className="w-4 h-4" />
      </button>

      <div className="section-content max-w-7xl mx-auto flex flex-col justify-center items-center text-center h-full px-4 relative z-20">
        <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-wider">
          ARKHAM ARCHIVES
        </h1>

        <div className="glass rounded-none p-8 max-w-4xl w-full mb-12 border border-white/5">
          <p className="text-lg md:text-xl text-gray-400 mb-12 font-light tracking-wide">
            Building the next evolution of the internet - a Matrix-like virtual
            world where education, industry, and innovation converge to create
            immersive, real-world experiences.
          </p>

          <div className="flex flex-col items-center gap-8">
            <div className="flex flex-wrap gap-4 justify-center">
              <button onClick={handleExplore} className="cta-button">
                Explore the Archives <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="https://www.youtube.com/@thearkhamexperience"
                target="_blank"
                rel="noopener noreferrer"
                className="cta-button"
              >
                <Youtube className="w-4 h-4" /> Watch Tutorial
              </a>

              <a
                href="https://www.linkedin.com/company/71332696/admin/dashboard/"
                target="_blank"
                rel="noopener noreferrer"
                className="cta-button"
              >
                <Linkedin className="w-4 h-4" /> LinkedIn
              </a>

              <a
                href="https://www.instagram.com/arkham.archives"
                target="_blank"
                rel="noopener noreferrer"
                className="cta-button"
              >
                <Instagram className="w-4 h-4" /> Instagram
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl">
              <div
                className="glass p-4 flex items-center justify-center gap-2 cursor-not-allowed relative group"
                title="Coming Soon"
              >
                <Download className="w-5 h-5" />
                <span>Android App</span>
                <Lock className="w-4 h-4 absolute top-2 right-2" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white text-sm">Coming Soon</span>
                </div>
              </div>
              <div
                className="glass p-4 flex items-center justify-center gap-2 cursor-not-allowed relative group"
                title="Coming Soon"
              >
                <Download className="w-5 h-5" />
                <span>iOS App</span>
                <Lock className="w-4 h-4 absolute top-2 right-2" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white text-sm">Coming Soon</span>
                </div>
              </div>
              <div
                className="glass p-4 flex items-center justify-center gap-2 cursor-not-allowed relative group"
                title="Coming Soon"
              >
                <Download className="w-5 h-5" />
                <span>Windows PC</span>
                <Lock className="w-4 h-4 absolute top-2 right-2" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white text-sm">Coming Soon</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
