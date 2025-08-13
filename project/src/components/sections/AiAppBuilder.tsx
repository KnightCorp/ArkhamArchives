import React, { useEffect, useRef } from 'react';
import { Bot } from 'lucide-react';

const AiAppBuilder: React.FC = () => {
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
    <div className="section-container" id="ai-app-builder" ref={sectionRef}>
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black z-10"></div>
        <img 
          src="https://images.pexels.com/photos/1434580/pexels-photo-1434580.jpeg"
          alt="Background"
          className="w-full h-full object-cover object-center filter grayscale brightness-75 contrast-125"
        />
      </div>
      
      <div className="section-content max-w-7xl mx-auto px-4 relative z-20">
        <div className="glass rounded-none p-8 md:p-12 max-w-3xl border border-white/5">
          <div className="flex items-center mb-6">
            <Bot className="w-8 h-8 text-white mr-4" />
            <h2 className="section-title">AI App Builder</h2>
          </div>
          
          <p className="section-subtitle">
            Create sophisticated web applications with just a prompt. Our AI app builder 
            transforms your ideas into functional, elegant web apps without writing a single 
            line of code.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="glass bg-black/40 overflow-hidden border border-white/5">
              <img 
                src="https://images.pexels.com/photos/7567619/pexels-photo-7567619.jpeg"
                alt="AI Code Generation"
                className="card-image"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">Prompt-driven Development</h3>
                <p className="text-gray-300">Describe your vision and watch as our AI crafts a complete application.</p>
              </div>
            </div>
            
            <div className="glass bg-black/40 overflow-hidden border border-white/5">
              <img 
                src="https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg"
                alt="Instant Prototyping"
                className="card-image"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">Instant Prototyping</h3>
                <p className="text-gray-300">Test your ideas in real-time with an interactive preview.</p>
              </div>
            </div>
            
            <div className="glass bg-black/40 overflow-hidden border border-white/5">
              <img 
                src="https://images.pexels.com/photos/2004161/pexels-photo-2004161.jpeg"
                alt="Code Flexibility"
                className="card-image"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">No-code to Full-code</h3>
                <p className="text-gray-300">Start with no-code and seamlessly transition to full development.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiAppBuilder;