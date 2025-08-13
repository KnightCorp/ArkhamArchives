import React, { useEffect, useRef } from 'react';
import { GraduationCap, ExternalLink, Brain, Globe, Code, Users, FlaskRound as Flask, Microscope } from 'lucide-react';

const EdTech: React.FC = () => {
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

  return (
    <div className="section-container" id="edtech" ref={sectionRef}>
      <video className="video-bg" autoPlay loop muted playsInline>
        <source src="https://player.vimeo.com/external/537900164.sd.mp4?s=6e26c3d7eb9f7986162881d694a28fdcacc538d7&profile_id=164" type="video/mp4" />
      </video>
      
      <div className="section-content max-w-[1920px] mx-auto px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="glass rounded-lg p-8 md:p-12">
            <div className="flex items-center mb-6">
              <GraduationCap className="w-8 h-8 text-white mr-4" />
              <h2 className="section-title">EdTech & Education</h2>
            </div>
            
            <p className="section-subtitle">
              Transform learning with immersive simulations, virtual laboratories, and interactive 
              experiences that make complex subjects accessible and engaging.
            </p>
            
            <div className="space-y-6 mb-8">
              <div className="glass bg-black/40 p-6 rounded">
                <h3 className="text-xl font-semibold mb-2">Virtual Laboratories</h3>
                <p className="text-gray-300">Conduct experiments in fully simulated environments that accurately model real-world physics and chemistry.</p>
              </div>
              
              <div className="glass bg-black/40 p-6 rounded">
                <h3 className="text-xl font-semibold mb-2">Interactive Visual Novels</h3>
                <p className="text-gray-300">Learn through narrative experiences where your choices shape the story and reinforce educational concepts.</p>
              </div>
              
              <div className="glass bg-black/40 p-6 rounded">
                <h3 className="text-xl font-semibold mb-2">Immersive Content Library</h3>
                <p className="text-gray-300">Access a vast collection of educational materials enhanced with interactive elements and adaptive difficulty.</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <button className="cta-button">
                Explore Learning Tools <GraduationCap className="ml-2 w-5 h-5" />
              </button>
              
              <a 
                href="https://www.youtube.com/@thearkhamexperience"
                target="_blank"
                rel="noopener noreferrer"
                className="cta-button bg-transparent border border-red-800 hover:bg-red-900/20"
              >
                Watch Tutorial <ExternalLink className="ml-2 w-5 h-5" />
              </a>
            </div>
          </div>

          <div className="glass rounded-lg p-8 md:p-12">
            <div className="flex items-center mb-6">
              <Brain className="w-8 h-8 text-white mr-4" />
              <h2 className="text-3xl font-bold">Prep Time</h2>
            </div>
            
            <p className="text-gray-400 mb-12">
              A dynamic economic system where developers, creators, and modders can monetize their work, customize experiences, and run virtual businesses in an immersive educational environment.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="glass bg-black/40 overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-75 z-10"></div>
                <img 
                  src="https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg"
                  alt="AI-Driven Case Studies"
                  className="w-full h-48 object-cover brightness-75 sepia hue-rotate-180 saturate-150"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                  <div className="flex items-center space-x-3 mb-2">
                    <Brain className="w-6 h-6 text-white" />
                    <h3 className="text-xl font-bold font-cinzel">AI-Driven Case Studies</h3>
                  </div>
                  <p className="text-white/70">Interactive Harvard Case Method with dynamic AI adaptation</p>
                </div>
              </div>

              <div className="glass bg-black/40 overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-75 z-10"></div>
                <img 
                  src="https://images.pexels.com/photos/3183132/pexels-photo-3183132.jpeg"
                  alt="Global Integration"
                  className="w-full h-48 object-cover brightness-75 sepia hue-rotate-180 saturate-150"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                  <div className="flex items-center space-x-3 mb-2">
                    <Globe className="w-6 h-6 text-white" />
                    <h3 className="text-xl font-bold font-cinzel">Global Integration</h3>
                  </div>
                  <p className="text-white/70">Real-world and virtual experiences across global hubs</p>
                </div>
              </div>

              <div className="glass bg-black/40 overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-75 z-10"></div>
                <img 
                  src="https://images.pexels.com/photos/3183183/pexels-photo-3183183.jpeg"
                  alt="Industry Simulation"
                  className="w-full h-48 object-cover brightness-75 sepia hue-rotate-180 saturate-150"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                  <div className="flex items-center space-x-3 mb-2">
                    <Code className="w-6 h-6 text-white" />
                    <h3 className="text-xl font-bold font-cinzel">Industry Simulation</h3>
                  </div>
                  <p className="text-white/70">Live business, law, medical, and tech simulations</p>
                </div>
              </div>

              <div className="glass bg-black/40 overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-75 z-10"></div>
                <img 
                  src="https://images.pexels.com/photos/3183190/pexels-photo-3183190.jpeg"
                  alt="Community Learning"
                  className="w-full h-48 object-cover brightness-75 sepia hue-rotate-180 saturate-150"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                  <div className="flex items-center space-x-3 mb-2">
                    <Users className="w-6 h-6 text-white" />
                    <h3 className="text-xl font-bold font-cinzel">Community Learning</h3>
                  </div>
                  <p className="text-white/70">Collaborative learning with gamification elements</p>
                </div>
              </div>

              <div className="glass bg-black/40 overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-75 z-10"></div>
                <img 
                  src="https://images.pexels.com/photos/3183186/pexels-photo-3183186.jpeg"
                  alt="Virtual Labs"
                  className="w-full h-48 object-cover brightness-75 sepia hue-rotate-180 saturate-150"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                  <div className="flex items-center space-x-3 mb-2">
                    <Flask className="w-6 h-6 text-white" />
                    <h3 className="text-xl font-bold font-cinzel">Virtual Labs</h3>
                  </div>
                  <p className="text-white/70">XR-powered laboratories and research facilities</p>
                </div>
              </div>

              <div className="glass bg-black/40 overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-75 z-10"></div>
                <img 
                  src="https://images.pexels.com/photos/3183165/pexels-photo-3183165.jpeg"
                  alt="Customizable Tools"
                  className="w-full h-48 object-cover brightness-75 sepia hue-rotate-180 saturate-150"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                  <div className="flex items-center space-x-3 mb-2">
                    <Microscope className="w-6 h-6 text-white" />
                    <h3 className="text-xl font-bold font-cinzel">Customizable Tools</h3>
                  </div>
                  <p className="text-white/70">Flexible tools for educators and organizations</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EdTech;