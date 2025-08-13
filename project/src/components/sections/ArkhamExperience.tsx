import React, { useEffect, useRef } from "react";
import {
  Gamepad2,
  Music,
  ExternalLink,
  Brain,
  Cpu,
  Globe,
  Headphones,
  Radio,
  Mic,
  Wand2,
  Bot,
  Code,
} from "lucide-react";

interface ExperienceCard {
  title: string;
  description: string;
  icon: any;
  image: string;
}

const ArkhamExperience: React.FC = () => {
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

  const experienceCards: ExperienceCard[] = [
    {
      title: "Spatial Computing",
      description:
        "Explore richly detailed environments where physical and digital worlds blend seamlessly",
      icon: Globe,
      image:
        "https://images.pexels.com/photos/3052361/pexels-photo-3052361.jpeg",
    },
    {
      title: "Neural Audio",
      description: "Generate and manipulate audio using advanced AI algorithms",
      icon: Brain,
      image:
        "https://images.pexels.com/photos/1626481/pexels-photo-1626481.jpeg",
    },
    {
      title: "Dynamic Soundscapes",
      description:
        "Create immersive audio environments that adapt to user interaction",
      icon: Radio,
      image:
        "https://images.pexels.com/photos/1389429/pexels-photo-1389429.jpeg",
    },
    {
      title: "Voice Synthesis",
      description: "Generate natural-sounding voices with emotional depth",
      icon: Mic,
      image:
        "https://images.pexels.com/photos/3779662/pexels-photo-3779662.jpeg",
    },
    {
      title: "AI-driven Simulations",
      description:
        "Experience intelligent entities that learn and adapt to your actions",
      icon: Cpu,
      image:
        "https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg",
    },
    {
      title: "Podcast Creation",
      description:
        "Generate complete podcast episodes with AI-powered conversations",
      icon: Headphones,
      image:
        "https://images.pexels.com/photos/3945683/pexels-photo-3945683.jpeg",
    },
  ];

  return (
    <div className="section-container" id="arkham-experience" ref={sectionRef}>
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
          <source src="/social1.mp4" type="video/mp4" />
          <p>Your browser doesn't support HTML video.</p>
        </video>
      </div>
      <div className="video-overlay"></div>

      <div className="section-content max-w-7xl mx-auto px-4">
        <div className="glass rounded-lg p-8 md:p-12 max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-4">
              <Gamepad2 className="w-8 h-8 text-white" />
              <Music className="w-8 h-8 text-white" />
              <h2 className="text-4xl font-black">Immersive Experience</h2>
            </div>
          </div>

          <p className="text-xl text-gray-400 mb-12 max-w-3xl">
            Step into a revolutionary fusion of gaming and audio technology.
            Experience immersive digital realms enhanced with dynamic
            soundscapes and AI-driven interactions.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {experienceCards.map((card, index) => (
              <div
                key={index}
                className="glass bg-black/40 overflow-hidden group relative h-[300px]"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-75 z-10"></div>
                <img
                  src={card.image}
                  alt={card.title}
                  className="absolute inset-0 w-full h-full object-cover brightness-75 sepia hue-rotate-180 saturate-150 group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                  <div className="flex items-center space-x-3 mb-2">
                    <card.icon className="w-6 h-6 text-white" />
                    <h3 className="text-xl font-bold">{card.title}</h3>
                  </div>
                  <p className="text-white/70">{card.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <button className="cta-button">
              Enter Experience <Wand2 className="w-5 h-5" />
            </button>

            <a
              href="https://www.youtube.com/@thearkhamexperience"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-button bg-transparent border border-red-800 hover:bg-red-900/20"
            >
              Watch Tutorial <ExternalLink className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
      {/* Bottom video section */}
      <div className="mt-16 max-w-7xl mx-auto px-4">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="w-full rounded-lg shadow-lg"
        >
          <source src="/expsec.mp4" type="video/mp4" />
          <p>Your browser doesn't support HTML video.</p>
        </video>
      </div>
    </div>
  );
};

export default ArkhamExperience;
