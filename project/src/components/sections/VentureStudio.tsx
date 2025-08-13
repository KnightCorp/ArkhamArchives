import React, { useEffect, useRef, useState } from "react";
import {
  Rocket,
  Building2,
  Globe,
  Cpu,
  Brain,
  Eye,
  Gamepad2,
  Dna,
  Satellite,
  Shield,
  Car,
  Briefcase,
  GraduationCap,
  Coins,
  Film,
  Shirt,
  Scale,
  Code,
  ChevronRight,
  ChevronLeft,
  Network,
  Users,
  Zap,
  Database,
  Microscope,
  Target,
  TrendingUp,
  Play,
  Info,
  Monitor,
  Layers,
} from "lucide-react";

const VentureStudio: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<"venture" | "os">("venture");
  const [currentHero, setCurrentHero] = useState(0);
  const [currentVentureIndex, setCurrentVentureIndex] = useState(0);

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

  const ventureHeroSlides = [
    {
      title: "Venture Studio Ecosystem",
      subtitle: "Building the Future Across All Sectors",
      description:
        "A sector-agnostic portfolio of sector-specific portfolios, pioneering spatial computing, distributed AI, and immersive digital ecosystems across global markets.",
      image:
        "https://images.pexels.com/photos/3052361/pexels-photo-3052361.jpeg",
    },
    {
      title: "Community-Owned AI Platform",
      subtitle: "Democratizing Artificial Intelligence",
      description:
        "Revolutionary blockchain-based platform where researchers contribute code, AI learns recursively, and contributors are automatically compensated through transparent usage tracking.",
      image:
        "https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg",
    },
    {
      title: "Strategic Portfolio Management",
      subtitle: "Resilient Investment Philosophy",
      description:
        "Fight tooth and nail on all fronts, but transform failing ventures into valuable asset portfolios that spawn new opportunities across multiple sectors.",
      image:
        "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg",
    },
  ];

  const osHeroSlides = [
    {
      title: "Future Operating System",
      subtitle: "Beyond Apps and Interfaces",
      description:
        "An open-world 3D immersive ecosystem that acts as both web and OS, combining spatial computing, neuromorphic processing, and biological data storage.",
      image:
        "https://images.pexels.com/photos/1563256/pexels-photo-1563256.jpeg",
    },
    {
      title: "Digital Consciousness Stream",
      subtitle: "Procedural Reality Interface",
      description:
        "UI and immersive experiences that procedurally develop in real-time and dissolve, creating a seamless digital limbo of consciousness.",
      image:
        "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg",
    },
    {
      title: "Bio-Tech Integration",
      subtitle: "Merging Biology with Technology",
      description:
        "Lab-grown brain cells powering AI, DNA data storage, and neuromorphic computing creating the next evolution of digital ecosystems.",
      image:
        "https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg",
    },
  ];

  const currentVentures = [
    {
      title: "Chronicles",
      subtitle: "Social Platform with Creator Tools",
      description:
        "A comprehensive social platform featuring AI-generated art and music, anonymous posting, vibes-based matching, journals with relationship insights, street maps discovery, multi-spectrum news coverage, livestreaming, mindmaps, and geo-based content. Creators can monetize through exclusive subscription content.",
      images: [
        "https://images.pexels.com/photos/2544554/pexels-photo-2544554.jpeg",
        "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg",
        "https://images.pexels.com/photos/3184639/pexels-photo-3184639.jpeg",
        "https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg",
      ],
      features: [
        "AI Art & Music Generation",
        "Anonymous Posting",
        "Vibes-Based Matching",
        "Relationship Insights",
        "Geo-Discovery",
        "Creator Subscriptions",
      ],
    },
    {
      title: "Discover Arkham",
      subtitle: "Fashion & Luxury Discovery Platform",
      description:
        "Discover the best fashion, luxury items, and experiences based on personal fit, style, interests, and vibes. Features AI-powered auction marketplace for designer and thrift fashion, custom design sourcing from social designers, live trend tracking, fashion shows, and UGC content creation.",
      images: [
        "https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg",
        "https://images.pexels.com/photos/3965545/pexels-photo-3965545.jpeg",
        "https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg",
        "https://images.pexels.com/photos/1884581/pexels-photo-1884581.jpeg",
      ],
      features: [
        "AI Fashion Auctions",
        "Custom Design Sourcing",
        "Live Trend Tracking",
        "Fashion Show Streaming",
        "Style Matching",
        "UGC Content",
      ],
    },
    {
      title: "Arkham Research",
      subtitle: "AI-Powered Research & Automation Platform",
      description:
        "Advanced research platform with web integration, code writing, task automation, scenario simulation, and probability analysis. Includes marketplace for data sharing, computation/storage rental, GPU access, automated training, and 25+ industry-specific digital labs.",
      images: [
        "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg",
        "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg",
        "https://images.pexels.com/photos/1563256/pexels-photo-1563256.jpeg",
        "https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg",
      ],
      features: [
        "Web Research & Integration",
        "Code Generation",
        "Scenario Simulation",
        "GPU Marketplace",
        "Digital Labs",
        "Data Sharing",
      ],
    },
    {
      title: "The Archives",
      subtitle: "Gamified AI-Powered EdTech",
      description:
        "Revolutionary education platform that gamifies learning with AI. Marketplace for live classes from experts, featuring visual novels, interactive story-based lessons, hyperrealistic 3D simulations with digital twins, AR/XR experiences, and immersive educational content.",
      images: [
        "https://images.pexels.com/photos/3183132/pexels-photo-3183132.jpeg",
        "https://images.pexels.com/photos/5473955/pexels-photo-5473955.jpeg",
        "https://images.pexels.com/photos/8438922/pexels-photo-8438922.jpeg",
        "https://images.pexels.com/photos/3052361/pexels-photo-3052361.jpeg",
      ],
      features: [
        "Gamified Learning",
        "Live Expert Classes",
        "Visual Novel Lessons",
        "3D Simulations",
        "AR/XR Integration",
        "Digital Twins",
      ],
    },
    {
      title: "Arkham AudioStudio",
      subtitle: "AI Audio Content Creation & Streaming",
      description:
        "Social audio platform with AI studio for converting documents into dynamic audio content. Features voice allocation, volume control, cinematic scores, and SFX. Supports podcasts, audio dramas, narrations, meditation content, and news. Includes voice licensing and cloning capabilities.",
      images: [
        "https://images.pexels.com/photos/3779662/pexels-photo-3779662.jpeg",
        "https://images.pexels.com/photos/1626481/pexels-photo-1626481.jpeg",
        "https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg",
        "https://images.pexels.com/photos/1389429/pexels-photo-1389429.jpeg",
      ],
      features: [
        "Document-to-Audio AI",
        "Dynamic Voice Allocation",
        "Cinematic Scoring",
        "Voice Cloning",
        "Publisher Partnerships",
        "Multi-Format Output",
      ],
    },
    {
      title: "Arkham Jobs",
      subtitle: "AI-Powered Remote Hiring & Talent Management",
      description:
        "Comprehensive job portal for remote hiring of early career professionals and interns. Features AI-based ATS and screening systems, vetted candidates with background checks, and complete employee lifecycle management including compliance, BGV, payroll, and leaves. Companies can hire directly or use our managed services with dedicated project managers.",
      images: [
        "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg",
        "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg",
        "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg",
        "https://images.pexels.com/photos/1181396/pexels-photo-1181396.jpeg",
      ],
      features: [
        "AI-Based ATS",
        "Background Verification",
        "Remote Talent Pool",
        "Lifecycle Management",
        "Managed Services",
        "Compliance Tools",
      ],
    },
    {
      title: "Arkham Gaming",
      subtitle: "UE5 Social Gaming & UGC Platform",
      description:
        "Unreal Engine 5-based social gaming platform for DIY and user-generated content. Enables users to build games and immersive experiences, create and customize virtual hangouts, and share them with the community using AI-powered tools. Features collaborative game development and social interaction spaces.",
      images: [
        "https://images.pexels.com/photos/3052361/pexels-photo-3052361.jpeg",
        "https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg",
        "https://images.pexels.com/photos/1293269/pexels-photo-1293269.jpeg",
        "https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg",
      ],
      features: [
        "Unreal Engine 5",
        "UGC Game Builder",
        "AI-Powered Tools",
        "Social Hangouts",
        "Collaborative Development",
        "Immersive Experiences",
      ],
    },
    {
      title: "AI XR Browser",
      subtitle: "Immersive Spatial Web with Blockchain Privacy",
      description:
        "Revolutionary XR browser for the spatial web that combines immersive 3D environments with blockchain-based encryption and data privacy. Navigate websites as immersive spaces, interact with content in 3D, and maintain complete control over your data through decentralized privacy protocols.",
      images: [
        "https://images.pexels.com/photos/5473955/pexels-photo-5473955.jpeg",
        "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg",
        "https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg",
        "https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg",
      ],
      features: [
        "Spatial Web Navigation",
        "3D Website Rendering",
        "Blockchain Encryption",
        "Decentralized Privacy",
        "XR Interface",
        "Data Sovereignty",
      ],
    },
  ];

  const coreThemes = [
    {
      title: "Spatial Computing",
      description:
        "3D immersive environments blending physical and digital worlds",
      image:
        "https://images.pexels.com/photos/3052361/pexels-photo-3052361.jpeg",
    },
    {
      title: "Web 3.0 & Distributed Computing",
      description: "Decentralized networks and community-owned infrastructure",
      image:
        "https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg",
    },
    {
      title: "Community-Based AI Ownership",
      description:
        "Democratized AI development and shared intelligence systems",
      image:
        "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg",
    },
    {
      title: "Immersive Experiences",
      description: "AR/XR technologies creating seamless reality integration",
      image:
        "https://images.pexels.com/photos/5473955/pexels-photo-5473955.jpeg",
    },
    {
      title: "Gamification & Discovery",
      description: "Interactive systems making complex processes engaging",
      image:
        "https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg",
    },
  ];

  const sectors = [
    {
      icon: GraduationCap,
      name: "EdTech",
      image:
        "https://images.pexels.com/photos/3183132/pexels-photo-3183132.jpeg",
    },
    {
      icon: Coins,
      name: "FinTech",
      image: "https://images.pexels.com/photos/730564/pexels-photo-730564.jpeg",
    },
    {
      icon: Film,
      name: "Media",
      image:
        "https://images.pexels.com/photos/2544554/pexels-photo-2544554.jpeg",
    },
    {
      icon: Shirt,
      name: "Fashion & Luxury",
      image:
        "https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg",
    },
    {
      icon: Microscope,
      name: "Research",
      image:
        "https://images.pexels.com/photos/3825537/pexels-photo-3825537.jpeg",
    },
    {
      icon: Scale,
      name: "Legal",
      image:
        "https://images.pexels.com/photos/3183183/pexels-photo-3183183.jpeg",
    },
    {
      icon: Code,
      name: "Pure Tech",
      image:
        "https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg",
    },
    {
      icon: Car,
      name: "AutoTech",
      image:
        "https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg",
    },
    {
      icon: Gamepad2,
      name: "Gaming",
      image:
        "https://images.pexels.com/photos/3052361/pexels-photo-3052361.jpeg",
    },
    {
      icon: Dna,
      name: "BioTech & Genetics",
      image:
        "https://images.pexels.com/photos/3825527/pexels-photo-3825527.jpeg",
    },
    {
      icon: Satellite,
      name: "SpaceTech",
      image:
        "https://images.pexels.com/photos/41162/moon-landing-apollo-11-nasa-buzz-aldrin-41162.jpeg",
    },
    {
      icon: Shield,
      name: "DefenseTech",
      image:
        "https://images.pexels.com/photos/60504/security-protection-anti-virus-software-60504.jpeg",
    },
  ];

  const osFeatures = [
    {
      title: "Neural Computing",
      description: "Lab-grown brain cells powering AI systems",
      image:
        "https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg",
    },
    {
      title: "DNA Data Storage",
      description: "Biological storage for massive data capacity",
      image:
        "https://images.pexels.com/photos/3825527/pexels-photo-3825527.jpeg",
    },
    {
      title: "Digital Twins",
      description: "Perfect replicas of physical systems",
      image:
        "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg",
    },
    {
      title: "Neuromorphic Computing",
      description: "Brain-inspired computing architectures",
      image:
        "https://images.pexels.com/photos/1563256/pexels-photo-1563256.jpeg",
    },
    {
      title: "Spatial Computing",
      description: "3D immersive ecosystem as web and OS",
      image:
        "https://images.pexels.com/photos/3052361/pexels-photo-3052361.jpeg",
    },
    {
      title: "Blockchain Integration",
      description: "Decentralized infrastructure and ownership",
      image:
        "https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg",
    },
  ];

  const markets = [
    { name: "APAC", description: "Asia-Pacific", flag: "🌏" },
    { name: "EMEA", description: "Europe, Middle East & Africa", flag: "🌍" },
    { name: "NA", description: "North America", flag: "🌎" },
  ];

  // Auto-advance hero slides
  useEffect(() => {
    const interval = setInterval(() => {
      const slides = activeTab === "venture" ? ventureHeroSlides : osHeroSlides;
      setCurrentHero((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [activeTab]);

  // Auto-advance venture slides
  useEffect(() => {
    if (activeTab === "venture") {
      const interval = setInterval(() => {
        setCurrentVentureIndex((prev) => (prev + 1) % currentVentures.length);
      }, 8000);
      return () => clearInterval(interval);
    }
  }, [activeTab]);

  const scrollThemes = (direction: "left" | "right") => {
    const container = document.getElementById("themes-container");
    if (container) {
      const scrollAmount = 320;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const scrollSectors = (direction: "left" | "right") => {
    const container = document.getElementById("sectors-container");
    if (container) {
      const scrollAmount = 280;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const scrollOS = (direction: "left" | "right") => {
    const container = document.getElementById("os-container");
    if (container) {
      const scrollAmount = 320;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const currentSlides =
    activeTab === "venture" ? ventureHeroSlides : osHeroSlides;

  return (
    <div className="section-container" id="venture-studio" ref={sectionRef}>
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

      <div className="section-content max-w-7xl mx-auto px-4">
        {/* Tab Navigation */}
        <div className="glass rounded-lg p-2 mb-8 max-w-md mx-auto">
          <div className="flex">
            <button
              onClick={() => {
                setActiveTab("venture");
                setCurrentHero(0);
              }}
              className={`flex-1 flex items-center justify-center gap-3 px-6 py-3 rounded transition-all duration-300 ${
                activeTab === "venture"
                  ? "bg-white/10 text-white border border-white/20"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Building2 className="w-5 h-5" />
              <span className="font-semibold">Venture Studio</span>
            </button>
            <button
              onClick={() => {
                setActiveTab("os");
                setCurrentHero(0);
              }}
              className={`flex-1 flex items-center justify-center gap-3 px-6 py-3 rounded transition-all duration-300 ${
                activeTab === "os"
                  ? "bg-white/10 text-white border border-white/20"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Monitor className="w-5 h-5" />
              <span className="font-semibold">Operating System</span>
            </button>
          </div>
        </div>

        {/* Hero Section */}
        <div className="glass rounded-lg p-8 md:p-12 mb-12 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <img
              src={currentSlides[currentHero].image}
              alt={currentSlides[currentHero].title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="relative z-10 text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-black mb-4 text-white">
              {currentSlides[currentHero].title}
            </h1>
            <h2 className="text-xl md:text-2xl text-gray-300 mb-6">
              {currentSlides[currentHero].subtitle}
            </h2>
            <p className="text-lg text-gray-400 mb-8 leading-relaxed">
              {currentSlides[currentHero].description}
            </p>

            {/* Hero Navigation Dots */}
            <div className="flex justify-center gap-2 mb-8">
              {currentSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentHero(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === currentHero ? "bg-white" : "bg-white/40"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Venture Studio Content */}
        {activeTab === "venture" && (
          <>
            {/* Core Investment Themes */}
            <div className="glass rounded-lg p-8 mb-12">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-white">
                  Core Investment Themes
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => scrollThemes("left")}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6 text-white" />
                  </button>
                  <button
                    onClick={() => scrollThemes("right")}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <ChevronRight className="w-6 h-6 text-white" />
                  </button>
                </div>
              </div>

              <div
                id="themes-container"
                className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
              >
                {coreThemes.map((theme, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 w-80 group cursor-pointer"
                  >
                    <div className="glass bg-black/40 overflow-hidden rounded-lg">
                      <div className="relative">
                        <img
                          src={theme.image}
                          alt={theme.title}
                          className="w-full h-48 object-cover brightness-75 sepia hue-rotate-180 saturate-150 group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <h3 className="text-xl font-bold text-white mb-2">
                            {theme.title}
                          </h3>
                          <p className="text-gray-300 text-sm">
                            {theme.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Current Ventures Slider */}
            <div className="glass rounded-lg p-8 mb-12">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-white">
                  Current Ventures in Development
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setCurrentVentureIndex(
                        Math.max(0, currentVentureIndex - 1)
                      )
                    }
                    disabled={currentVentureIndex === 0}
                    className="p-2 bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed rounded-full transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6 text-white" />
                  </button>
                  <button
                    onClick={() =>
                      setCurrentVentureIndex(
                        Math.min(
                          currentVentures.length - 1,
                          currentVentureIndex + 1
                        )
                      )
                    }
                    disabled={
                      currentVentureIndex === currentVentures.length - 1
                    }
                    className="p-2 bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed rounded-full transition-colors"
                  >
                    <ChevronRight className="w-6 h-6 text-white" />
                  </button>
                </div>
              </div>

              <div className="relative overflow-hidden rounded-lg">
                <div
                  className="flex transition-transform duration-700 ease-in-out"
                  style={{
                    transform: `translateX(-${currentVentureIndex * 100}%)`,
                  }}
                >
                  {currentVentures.map((venture, index) => (
                    <div key={index} className="w-full flex-shrink-0">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center p-8">
                        <div>
                          <h3 className="text-4xl font-bold text-white mb-4">
                            {venture.title}
                          </h3>
                          <h4 className="text-xl text-gray-300 mb-6">
                            {venture.subtitle}
                          </h4>
                          <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                            {venture.description}
                          </p>

                          <div className="grid grid-cols-2 gap-4">
                            {venture.features.map((feature, featureIndex) => (
                              <div
                                key={featureIndex}
                                className="flex items-center gap-3"
                              >
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                                <span className="text-gray-300 text-sm">
                                  {feature}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="relative">
                          {/* Image Gallery */}
                          <div className="grid grid-cols-2 gap-4">
                            {venture.images.map((image, imageIndex) => (
                              <img
                                key={imageIndex}
                                src={image}
                                alt={`${venture.title} ${imageIndex + 1}`}
                                className="w-full h-48 object-cover rounded-lg"
                              />
                            ))}
                          </div>
                          <div className="absolute bottom-6 left-6 right-6">
                            <div className="bg-black/80 backdrop-blur-sm rounded-lg p-4">
                              <div className="text-white font-semibold mb-2">
                                Status: In Development
                              </div>
                              <div className="w-full bg-white/20 rounded-full h-2">
                                <div
                                  className="bg-white rounded-full h-2 transition-all duration-1000"
                                  style={{ width: `${(index + 1) * 20}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Venture Navigation Dots */}
              <div className="flex justify-center gap-2 mt-8">
                {currentVentures.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentVentureIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentVentureIndex ? "bg-white" : "bg-white/40"
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Sector Portfolios */}
            <div className="glass rounded-lg p-8 mb-12">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-bold text-white">
                  Sector-Specific Portfolios
                </h2>
                <div className="flex gap-2">
                  <button
                    onClick={() => scrollSectors("left")}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6 text-white" />
                  </button>
                  <button
                    onClick={() => scrollSectors("right")}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <ChevronRight className="w-6 h-6 text-white" />
                  </button>
                </div>
              </div>

              <div
                id="sectors-container"
                className="flex gap-4 overflow-x-auto scrollbar-hide pb-4"
              >
                {sectors.map((sector, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 w-64 group cursor-pointer"
                  >
                    <div className="glass bg-black/40 overflow-hidden rounded-lg">
                      <div className="relative">
                        <img
                          src={sector.image}
                          alt={sector.name}
                          className="w-full h-36 object-cover brightness-75 sepia hue-rotate-180 saturate-150 group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <sector.icon className="w-8 h-8 text-white mx-auto mb-2" />
                            <span className="text-white font-semibold">
                              {sector.name}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Global Markets */}
            <div className="glass rounded-lg p-8 mb-12">
              <h2 className="text-3xl font-bold text-white mb-8">
                Global Market Presence
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {markets.map((market, index) => (
                  <div
                    key={index}
                    className="glass bg-black/40 rounded-lg p-8 text-center hover:bg-black/30 transition-colors"
                  >
                    <div className="text-6xl mb-4">{market.flag}</div>
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {market.name}
                    </h3>
                    <p className="text-gray-400">{market.description}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Community AI Platform */}
            <div className="glass rounded-lg p-8 mb-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-4xl font-bold text-white mb-6">
                    Community-Owned AI Platform
                  </h2>
                  <p className="text-xl text-gray-300 mb-8">
                    Revolutionary blockchain-based platform where researchers
                    submit original code, AI assistants learn recursively, and
                    contributors are automatically compensated through
                    transparent usage tracking.
                  </p>

                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <Code className="w-6 h-6 text-white mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="text-white font-semibold mb-2">
                          Research Code Submission
                        </h4>
                        <p className="text-gray-400">
                          Submit original, working research code to the
                          community platform
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <Brain className="w-6 h-6 text-white mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="text-white font-semibold mb-2">
                          Recursive AI Learning
                        </h4>
                        <p className="text-gray-400">
                          AI systems learn and integrate community contributions
                          automatically
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <Coins className="w-6 h-6 text-white mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="text-white font-semibold mb-2">
                          Usage-Based Compensation
                        </h4>
                        <p className="text-gray-400">
                          Blockchain tracks usage and automatically pays
                          contributors
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <img
                    src="https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg"
                    alt="Community AI Platform"
                    className="w-full h-96 object-cover rounded-lg brightness-75 sepia hue-rotate-180 saturate-150"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg"></div>
                </div>
              </div>
            </div>

            {/* Strategic Philosophy */}
            <div className="glass rounded-lg p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="relative">
                  <img
                    src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg"
                    alt="Strategic Philosophy"
                    className="w-full h-96 object-cover rounded-lg brightness-75 sepia hue-rotate-180 saturate-150"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg"></div>
                </div>

                <div>
                  <h2 className="text-4xl font-bold text-white mb-6">
                    Strategic Philosophy
                  </h2>
                  <blockquote className="text-2xl text-gray-300 mb-8 italic">
                    "Fight tooth and nail on all fronts, but if a ship is about
                    to go down and there's no way to win, identify the loser and
                    turn it into a husk."
                  </blockquote>
                  <p className="text-lg text-gray-400 mb-8">
                    Transform failing ventures into valuable assets: portfolios
                    of sector-specific startups, SMEs, stocks, intellectual
                    property, and networks. Let 20 others be born from that
                    foundation.
                  </p>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="glass bg-black/30 rounded-lg p-4">
                      <Building2 className="w-8 h-8 text-white mb-2" />
                      <span className="text-white font-semibold">
                        Startup Portfolios
                      </span>
                    </div>
                    <div className="glass bg-black/30 rounded-lg p-4">
                      <TrendingUp className="w-8 h-8 text-white mb-2" />
                      <span className="text-white font-semibold">
                        Strategic Equity
                      </span>
                    </div>
                    <div className="glass bg-black/30 rounded-lg p-4">
                      <Brain className="w-8 h-8 text-white mb-2" />
                      <span className="text-white font-semibold">
                        IP Libraries
                      </span>
                    </div>
                    <div className="glass bg-black/30 rounded-lg p-4">
                      <Network className="w-8 h-8 text-white mb-2" />
                      <span className="text-white font-semibold">Networks</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Operating System Content */}
        {activeTab === "os" && (
          <>
            {/* OS Vision */}
            <div className="glass rounded-lg p-8 mb-12">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-white mb-6">
                  Future Operating System
                </h2>
                <p className="text-xl text-gray-300 max-w-4xl mx-auto">
                  An open-world, ever-expanding 3D immersive ecosystem that
                  simultaneously acts as the web and operating system—removing
                  the need for traditional apps entirely.
                </p>
              </div>
            </div>

            {/* Integrated Technologies */}
            <div className="glass rounded-lg p-8 mb-12">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-white">
                  Integrated Technologies
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => scrollOS("left")}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6 text-white" />
                  </button>
                  <button
                    onClick={() => scrollOS("right")}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <ChevronRight className="w-6 h-6 text-white" />
                  </button>
                </div>
              </div>

              <div
                id="os-container"
                className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
              >
                {osFeatures.map((feature, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 w-80 group cursor-pointer"
                  >
                    <div className="glass bg-black/40 overflow-hidden rounded-lg">
                      <div className="relative">
                        <img
                          src={feature.image}
                          alt={feature.title}
                          className="w-full h-48 object-cover brightness-75 sepia hue-rotate-180 saturate-150 group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                          <h4 className="text-xl font-bold text-white mb-2">
                            {feature.title}
                          </h4>
                          <p className="text-gray-300 text-sm">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* OS Features Grid */}
            <div className="glass rounded-lg p-8 mb-12">
              <h3 className="text-3xl font-bold text-white mb-8">
                Core OS Features
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="glass bg-black/40 p-6 rounded-lg">
                  <Layers className="w-8 h-8 text-white mb-4" />
                  <h4 className="text-xl font-bold text-white mb-2">
                    Procedural UI
                  </h4>
                  <p className="text-gray-300">
                    Interfaces that develop and dissolve in real-time based on
                    user needs
                  </p>
                </div>

                <div className="glass bg-black/40 p-6 rounded-lg">
                  <Eye className="w-8 h-8 text-white mb-4" />
                  <h4 className="text-xl font-bold text-white mb-2">
                    AR/XR Integration
                  </h4>
                  <p className="text-gray-300">
                    Seamless augmented and extended reality experiences
                  </p>
                </div>

                <div className="glass bg-black/40 p-6 rounded-lg">
                  <Brain className="w-8 h-8 text-white mb-4" />
                  <h4 className="text-xl font-bold text-white mb-2">
                    BCI Interface
                  </h4>
                  <p className="text-gray-300">
                    Brain-computer interfaces for direct neural interaction
                  </p>
                </div>

                <div className="glass bg-black/40 p-6 rounded-lg">
                  <Network className="w-8 h-8 text-white mb-4" />
                  <h4 className="text-xl font-bold text-white mb-2">
                    IoT Ecosystem
                  </h4>
                  <p className="text-gray-300">
                    Connected devices and smart environment integration
                  </p>
                </div>

                <div className="glass bg-black/40 p-6 rounded-lg">
                  <Cpu className="w-8 h-8 text-white mb-4" />
                  <h4 className="text-xl font-bold text-white mb-2">
                    Robotics Layer
                  </h4>
                  <p className="text-gray-300">
                    Physical world interaction through robotic systems
                  </p>
                </div>

                <div className="glass bg-black/40 p-6 rounded-lg">
                  <Globe className="w-8 h-8 text-white mb-4" />
                  <h4 className="text-xl font-bold text-white mb-2">
                    Device Agnostic
                  </h4>
                  <p className="text-gray-300">
                    Works seamlessly across all devices and platforms
                  </p>
                </div>
              </div>
            </div>

            {/* Bio-Tech Integration */}
            <div className="glass rounded-lg p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-4xl font-bold text-white mb-6">
                    Bio-Tech Integration
                  </h2>
                  <p className="text-xl text-gray-300 mb-8">
                    Combining aspects of technology and biology using spatial
                    computing, neuromorphic processing, and biological data
                    storage systems.
                  </p>

                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <Dna className="w-6 h-6 text-white mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="text-white font-semibold mb-2">
                          DNA Data Storage
                        </h4>
                        <p className="text-gray-400">
                          Massive data capacity using biological storage systems
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <Brain className="w-6 h-6 text-white mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="text-white font-semibold mb-2">
                          Lab-Grown Brain Cells
                        </h4>
                        <p className="text-gray-400">
                          Biological neural networks powering AI systems
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <Cpu className="w-6 h-6 text-white mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="text-white font-semibold mb-2">
                          Neuromorphic Computing
                        </h4>
                        <p className="text-gray-400">
                          Brain-inspired computing architectures and processing
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <Eye className="w-6 h-6 text-white mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="text-white font-semibold mb-2">
                          AI Civilizations
                        </h4>
                        <p className="text-gray-400">
                          Digital twins and AI simulations of complex systems
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <img
                    src="https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg"
                    alt="Bio-Tech Integration"
                    className="w-full h-96 object-cover rounded-lg brightness-75 sepia hue-rotate-180 saturate-150"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent rounded-lg"></div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VentureStudio;
