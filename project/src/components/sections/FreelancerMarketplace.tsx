import React, { useEffect, useRef } from 'react';
import { Briefcase, ExternalLink, Bot, Code, Globe, Cpu, Brain, Users, Rocket, Building } from 'lucide-react';

interface AgentCard {
  title: string;
  description: string;
  icon: any;
  image: string;
}

const FreelancerMarketplace: React.FC = () => {
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

  const agentCards: AgentCard[] = [
    {
      title: "Sales Automation",
      description: "Multi-agent systems for lead generation and conversion",
      icon: Users,
      image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg"
    },
    {
      title: "HR Management",
      description: "Automated recruitment and employee engagement",
      icon: Building,
      image: "https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg"
    },
    {
      title: "Legal Assistant",
      description: "Contract analysis and compliance automation",
      icon: Briefcase,
      image: "https://images.pexels.com/photos/3184296/pexels-photo-3184296.jpeg"
    },
    {
      title: "Financial Analysis",
      description: "Automated reporting and market analysis",
      icon: Brain,
      image: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg"
    },
    {
      title: "Design System",
      description: "AI-powered design and branding automation",
      icon: Rocket,
      image: "https://images.pexels.com/photos/3184287/pexels-photo-3184287.jpeg"
    },
    {
      title: "DevOps Agent",
      description: "Automated deployment and infrastructure management",
      icon: Cpu,
      image: "https://images.pexels.com/photos/3184285/pexels-photo-3184285.jpeg"
    }
  ];

  return (
    <div className="section-container" id="freelancer-marketplace" ref={sectionRef}>
      <video className="video-bg" autoPlay loop muted playsInline>
        <source src="https://player.vimeo.com/external/471597840.sd.mp4?s=e5deb5d622c29456cbe00968bd4c3752ce661140&profile_id=164" type="video/mp4" />
      </video>
      
      <div className="section-content max-w-7xl mx-auto px-4">
        <div className="glass rounded-none p-8 md:p-12 border border-white/5">
          <div className="flex items-center mb-6">
            <Briefcase className="w-8 h-8 text-white mr-4" />
            <h2 className="section-title">Freelancer Marketplace</h2>
          </div>
          
          <p className="section-subtitle">
            Connect with elite talent or offer your services in our curated marketplace, 
            enhanced with AI agents that streamline collaboration and design processes.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            <div className="glass bg-black/40 overflow-hidden border border-white/5">
              <img 
                src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg"
                alt="AI Agent Collaboration"
                className="card-image"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">AI Agent Collaboration</h3>
                <p className="text-gray-300">Work alongside intelligent agents that handle routine tasks.</p>
              </div>
            </div>
            
            <div className="glass bg-black/40 overflow-hidden border border-white/5">
              <img 
                src="https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg"
                alt="Design Studio"
                className="card-image"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">Design Studio</h3>
                <p className="text-gray-300">Access powerful design tools enhanced by AI.</p>
              </div>
            </div>
            
            <div className="glass bg-black/40 overflow-hidden border border-white/5">
              <img 
                src="https://images.pexels.com/photos/3184296/pexels-photo-3184296.jpeg"
                alt="Skill Matching"
                className="card-image"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">Skill-based Matching</h3>
                <p className="text-gray-300">Our advanced algorithm connects you with perfect matches.</p>
              </div>
            </div>
          </div>

          <div className="mt-20">
            <div className="flex items-center mb-8">
              <Bot className="w-8 h-8 text-white mr-4" />
              <h2 className="text-3xl font-bold">Agent Studio</h2>
            </div>
            
            <p className="text-xl text-gray-400 mb-12">
              Build and deploy full-stack applications with AI-powered development tools. Create custom 
              multi-agent systems for various business processes with our enterprise frameworks.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {agentCards.map((card, index) => (
                <div key={index} className="glass bg-black/40 overflow-hidden group relative h-[300px]">
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

            <div className="glass bg-black/40 p-8 rounded-lg mb-12">
              <h3 className="text-2xl font-bold mb-6">Custom Domain Deployment</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Globe className="w-6 h-6 text-white" />
                    <p className="text-gray-300">Deploy to your custom domain with one click</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Code className="w-6 h-6 text-white" />
                    <p className="text-gray-300">Automatic SSL and CDN configuration</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Bot className="w-6 h-6 text-white" />
                    <p className="text-gray-300">AI-powered performance optimization</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Cpu className="w-6 h-6 text-white" />
                    <p className="text-gray-300">Scalable infrastructure management</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <button className="cta-button">
              Launch Agent Studio <Bot className="w-4 h-4" />
            </button>
            
            <a 
              href="https://www.youtube.com/@thearkhamexperience"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-button bg-transparent border border-red-800 hover:bg-red-900/20"
            >
              Watch Tutorial <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerMarketplace;