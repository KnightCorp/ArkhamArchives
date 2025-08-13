import React, { useEffect, useRef } from 'react';
import { Search, Brain, Shield, Database, Lock, UserCheck, Microscope, LineChart, Users, Globe, Laptop, FileSearch, Briefcase, Newspaper, Rocket, ShieldAlert, Shirt, Megaphone, Network, Target, Eye, AlertTriangle, Zap, Fingerprint, GitBranch, TrendingUp } from 'lucide-react';

const AiResearch: React.FC = () => {
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

  const frameworkFeatures = [
    {
      icon: Brain,
      title: "Framework Thinking",
      desc: "Second Order, First Principles, MECE, Pareto, Fishbone Analysis, Root Cause Analysis",
      image: "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg"
    },
    {
      icon: Target,
      title: "Contingency Planning",
      desc: "Comprehensive scenario planning and risk mitigation strategies",
      image: "https://images.pexels.com/photos/7567444/pexels-photo-7567444.jpeg"
    },
    {
      icon: Eye,
      title: "Hypothetical Scenarios",
      desc: "Advanced simulation and scenario modeling for strategic planning",
      image: "https://images.pexels.com/photos/5473955/pexels-photo-5473955.jpeg"
    },
    {
      icon: AlertTriangle,
      title: "Bias Detection",
      desc: "Sophisticated algorithms to identify and mitigate cognitive and data biases",
      image: "https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg"
    }
  ];

  const analyticalCapabilities = [
    {
      icon: Zap,
      title: "Event Probability",
      desc: "Predictive analytics for event likelihood and impact assessment",
      image: "https://images.pexels.com/photos/7567596/pexels-photo-7567596.jpeg"
    },
    {
      icon: TrendingUp,
      title: "Trends & Correlation",
      desc: "Advanced pattern recognition and correlation analysis across datasets",
      image: "https://images.pexels.com/photos/7567619/pexels-photo-7567619.jpeg"
    },
    {
      icon: Fingerprint,
      title: "People Profiling",
      desc: "Digital footprint detection, OSINT, and comprehensive profile analysis",
      image: "https://images.pexels.com/photos/8728380/pexels-photo-8728380.jpeg"
    },
    {
      icon: GitBranch,
      title: "Connection Mapping",
      desc: "Primary, Secondary, and Tertiary connection analysis and visualization",
      image: "https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg"
    }
  ];

  const domains = [
    { icon: Microscope, name: "Medical & Biotech", image: "https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg" },
    { icon: Briefcase, name: "Finance & Investing", image: "https://images.pexels.com/photos/7567444/pexels-photo-7567444.jpeg" },
    { icon: Users, name: "Human Resources", image: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg" },
    { icon: Brain, name: "Corporate Strategy", image: "https://images.pexels.com/photos/3183183/pexels-photo-3183183.jpeg" },
    { icon: Newspaper, name: "Media & PR", image: "https://images.pexels.com/photos/518543/pexels-photo-518543.jpeg" },
    { icon: Rocket, name: "Space & Geo", image: "https://images.pexels.com/photos/41162/moon-landing-apollo-11-nasa-buzz-aldrin-41162.jpeg" },
    { icon: ShieldAlert, name: "Digital Forensics", image: "https://images.pexels.com/photos/5380642/pexels-photo-5380642.jpeg" },
    { icon: Shirt, name: "Fashion & Luxury", image: "https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg" },
    { icon: Megaphone, name: "Marketing", image: "https://images.pexels.com/photos/905163/pexels-photo-905163.jpeg" }
  ];

  return (
    <div className="section-container" id="ai-research" ref={sectionRef}>
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black z-10"></div>
        <img 
          src="https://images.pexels.com/photos/2603464/pexels-photo-2603464.jpeg"
          alt="Background"
          className="w-full h-full object-cover object-center filter grayscale brightness-75 contrast-125"
        />
      </div>
      
      <div className="section-content max-w-[1920px] mx-auto px-12 py-24 relative z-20">
        <div className="glass rounded-lg p-12 mb-24">
          <div className="flex items-center mb-12">
            <Search className="w-12 h-12 text-white mr-6" />
            <h2 className="text-5xl font-black">The Ultimate AI Research Engine</h2>
          </div>
          
          <p className="text-xl text-gray-300 mb-16 max-w-4xl">
            Combining advanced frameworks, comprehensive data sources, and intelligent analysis 
            across multiple domains to deliver unparalleled research capabilities with actionable insights.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {frameworkFeatures.map((feature, index) => (
              <div key={index} className="glass bg-black/40 overflow-hidden group relative h-[300px]">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-75 z-10"></div>
                <img 
                  src={feature.image}
                  alt={feature.title}
                  className="absolute inset-0 w-full h-full object-cover brightness-75 sepia hue-rotate-180 saturate-150 group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                  <div className="flex items-center space-x-3 mb-2">
                    <feature.icon className="w-8 h-8 text-white" />
                    <h3 className="text-xl font-bold">{feature.title}</h3>
                  </div>
                  <p className="text-white/70">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {analyticalCapabilities.map((feature, index) => (
              <div key={index} className="glass bg-black/40 overflow-hidden group relative h-[300px]">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-75 z-10"></div>
                <img 
                  src={feature.image}
                  alt={feature.title}
                  className="absolute inset-0 w-full h-full object-cover brightness-75 sepia hue-rotate-180 saturate-150 group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                  <div className="flex items-center space-x-3 mb-2">
                    <feature.icon className="w-8 h-8 text-white" />
                    <h3 className="text-xl font-bold">{feature.title}</h3>
                  </div>
                  <p className="text-white/70">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="glass bg-black/40 p-8 mb-16">
            <h3 className="text-2xl font-bold mb-8">Premium Research Capabilities</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Globe className="w-6 h-6 text-white" />
                  <p className="text-gray-300">Macro Insights</p>
                </div>
                <div className="flex items-center gap-3">
                  <Brain className="w-6 h-6 text-white" />
                  <p className="text-gray-300">Pattern Analysis</p>
                </div>
                <div className="flex items-center gap-3">
                  <Database className="w-6 h-6 text-white" />
                  <p className="text-gray-300">Premium Data Sources</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Shield className="w-6 h-6 text-white" />
                  <p className="text-gray-300">Due Diligence</p>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-6 h-6 text-white" />
                  <p className="text-gray-300">Behavioral Profiling</p>
                </div>
                <div className="flex items-center gap-3">
                  <Network className="w-6 h-6 text-white" />
                  <p className="text-gray-300">Network Analysis</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Lock className="w-6 h-6 text-white" />
                  <p className="text-gray-300">Background Checks</p>
                </div>
                <div className="flex items-center gap-3">
                  <FileSearch className="w-6 h-6 text-white" />
                  <p className="text-gray-300">Deep Research</p>
                </div>
                <div className="flex items-center gap-3">
                  <Eye className="w-6 h-6 text-white" />
                  <p className="text-gray-300">Trend Detection</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-8">Research Domains</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {domains.map((domain, index) => (
                <div key={index} className="glass bg-black/40 overflow-hidden group relative h-[200px]">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-75 z-10"></div>
                  <img 
                    src={domain.image}
                    alt={domain.name}
                    className="absolute inset-0 w-full h-full object-cover brightness-75 sepia hue-rotate-180 saturate-150 group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                    <div className="flex items-center space-x-3">
                      <domain.icon className="w-8 h-8 text-white" />
                      <h3 className="text-xl font-bold">{domain.name}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiResearch;