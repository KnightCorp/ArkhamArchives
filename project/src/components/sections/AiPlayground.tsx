import React, { useEffect, useRef } from 'react';
import { Code, ExternalLink, Bot, Search, Database, Brain, Cpu, Globe, Shield, Zap } from 'lucide-react';

const AiPlayground: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
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

  const aiFeatures = [
    {
      icon: Bot,
      title: "AI Agents Integration",
      desc: "Vertical & swarm bots with automated installation and API integration",
      image: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg"
    },
    {
      icon: Brain,
      title: "ML Models & Workflows",
      desc: "Seamlessly integrate and orchestrate machine learning models",
      image: "https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg"
    },
    {
      icon: Code,
      title: "Open-source Integration",
      desc: "GitHub projects & proprietary AI models with automated debugging",
      image: "https://images.pexels.com/photos/2004161/pexels-photo-2004161.jpeg"
    },
    {
      icon: Database,
      title: "Data Marketplace",
      desc: "Buy, sell, and trade data with complete blockchain transparency",
      image: "https://images.pexels.com/photos/3183183/pexels-photo-3183183.jpeg"
    },
    {
      icon: Shield,
      title: "Secure Sandboxing",
      desc: "Protected environment for testing and development",
      image: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg"
    },
    {
      icon: Zap,
      title: "Revenue Generation",
      desc: "Earn from ads and data sharing on the platform",
      image: "https://images.pexels.com/photos/3183132/pexels-photo-3183132.jpeg"
    }
  ];

  const searchFeatures = [
    {
      icon: Search,
      title: "Agentic Search",
      desc: "Autonomous agents that conduct deep research and automate tasks",
      image: "https://images.pexels.com/photos/3183165/pexels-photo-3183165.jpeg"
    },
    {
      icon: Brain,
      title: "Personalized Experience",
      desc: "Adaptive search that learns from behavior and preferences",
      image: "https://images.pexels.com/photos/3183186/pexels-photo-3183186.jpeg"
    },
    {
      icon: Globe,
      title: "Immersive Browser",
      desc: "Chromium-based browser with Unreal Engine and AR/XR integration",
      image: "https://images.pexels.com/photos/3183190/pexels-photo-3183190.jpeg"
    },
    {
      icon: Cpu,
      title: "Digital Terminals",
      desc: "Automated task execution and research automation",
      image: "https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg"
    }
  ];

  return (
    <div className="section-container" id="ai-playground" ref={sectionRef}>
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black z-10"></div>
        <img 
          src="https://images.pexels.com/photos/3052361/pexels-photo-3052361.jpeg"
          alt="Background"
          className="w-full h-full object-cover object-center filter grayscale brightness-75 contrast-125"
        />
      </div>
      
      <div className="section-content max-w-[1920px] mx-auto px-12 py-24 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
          {/* AI Orchestrator Section */}
          <div className="glass rounded-lg p-12">
            <div className="flex items-center mb-8">
              <Code className="w-10 h-10 text-white mr-6" />
              <h2 className="section-title text-4xl">Universal AI Orchestrator</h2>
            </div>
            
            <p className="section-subtitle text-xl mb-12">
              A comprehensive platform that integrates AI agents, ML models, and workflows into a 
              seamless ecosystem with automated installation, debugging, and sandboxing.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {aiFeatures.map((feature, index) => (
                <div key={index} className="glass bg-black/40 overflow-hidden group h-[300px]">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-75 z-10"></div>
                  <img 
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover brightness-75 sepia hue-rotate-180 saturate-150"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                    <div className="flex items-center space-x-4 mb-3">
                      <feature.icon className="w-8 h-8 text-white" />
                      <h3 className="text-2xl font-bold font-cinzel">{feature.title}</h3>
                    </div>
                    <p className="text-white/70 text-lg">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Search Engine Section */}
          <div className="glass rounded-lg p-12">
            <div className="flex items-center mb-8">
              <Search className="w-10 h-10 text-white mr-6" />
              <h2 className="section-title text-4xl">Intelligent Search</h2>
            </div>
            
            <p className="section-subtitle text-xl mb-12">
              Advanced search capabilities powered by autonomous agents and machine learning models, 
              delivering personalized and immersive research experiences.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {searchFeatures.map((feature, index) => (
                <div key={index} className="glass bg-black/40 overflow-hidden group h-[300px]">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-75 z-10"></div>
                  <img 
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover brightness-75 sepia hue-rotate-180 saturate-150"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                    <div className="flex items-center space-x-4 mb-3">
                      <feature.icon className="w-8 h-8 text-white" />
                      <h3 className="text-2xl font-bold font-cinzel">{feature.title}</h3>
                    </div>
                    <p className="text-white/70 text-lg">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-6 justify-center mt-16">
          <button className="cta-button text-lg px-12 py-4">
            Enter Playground <Code className="w-5 h-5 text-white ml-2" />
          </button>
          
          <a 
            href="https://www.youtube.com/@thearkhamexperience"
            target="_blank"
            rel="noopener noreferrer"
            className="cta-button text-lg px-12 py-4 bg-transparent border border-red-800 hover:bg-red-900/20"
          >
            Watch Tutorial <ExternalLink className="w-5 h-5 text-white ml-2" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default AiPlayground;