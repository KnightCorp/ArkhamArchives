import React, { useEffect, useRef } from 'react';
import { Users, MapPin, Target, Lightbulb } from 'lucide-react';

const People: React.FC = () => {
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
    <div className="section-container" id="people" ref={sectionRef}>
      <video className="video-bg" autoPlay loop muted playsInline>
        <source src="https://player.vimeo.com/external/451089383.sd.mp4?s=6b6c5796ee0b3cf507c348a40e62af4eef7ee7d4&profile_id=164" type="video/mp4" />
      </video>
      
      <div className="section-content max-w-7xl mx-auto px-4">
        <div className="glass rounded-lg p-8 md:p-12 border border-white/5">
          <div className="flex items-center mb-6">
            <Users className="w-8 h-8 text-white mr-4" />
            <h2 className="section-title">Leadership</h2>
          </div>

          <div className="mb-12 space-y-8">
            <div className="flex items-start gap-6 flex-wrap md:flex-nowrap">
              <div className="w-full md:w-1/2">
                <div className="flex items-center mb-4">
                  <Target className="w-6 h-6 text-white mr-3" />
                  <h3 className="text-2xl font-bold">Mission</h3>
                </div>
                <div className="space-y-6 text-gray-300 leading-relaxed">
                  <div>
                    <h4 className="font-semibold mb-2">A Digital Campus for the Future</h4>
                    <p>Creating an immersive educational ecosystem that combines virtual labs, industry connections, and real-world applications. We empower learners with practical experience and networking opportunities.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Industry Integration</h4>
                    <p>Building a dynamic environment where theory meets practice, offering hands-on experience in global team management, negotiations, and real-world problem-solving.</p>
                  </div>
                </div>
              </div>
              
              <div className="w-full md:w-1/2">
                <div className="flex items-center mb-4">
                  <Lightbulb className="w-6 h-6 text-white mr-3" />
                  <h3 className="text-2xl font-bold">Vision</h3>
                </div>
                <div className="space-y-6 text-gray-300 leading-relaxed">
                  <p className="font-semibold italic">"Creating a Matrix-like virtual world that seamlessly blends with reality, revolutionizing how we learn, work, and interact."</p>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Digital Twin World</h4>
                    <p>Every object in our world is a functional digital twin, creating an interconnected ecosystem where technology, education, and industry converge to offer unprecedented learning and working experiences.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-white" />
              <span className="text-gray-300">Bangalore, India</span>
            </div>
          </div>

          <div className="max-w-sm mx-auto">
            <div className="glass bg-black/40 overflow-hidden border border-white/5">
              <img 
                src="https://i.imgur.com/dYWiL3U.png"
                alt="Roy Ch."
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-1">Roy Ch.</h3>
                <p className="text-red-500 text-sm mb-2">Chief Vision Officer</p>
                <p className="text-gray-400 text-sm">Ex-Accenture innovator pioneering the future of digital ecosystems. Driving the vision for next-gen virtual worlds that transform education and industry.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default People;