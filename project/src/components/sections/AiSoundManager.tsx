import React, { useEffect, useRef } from 'react';
import { Music, ExternalLink, FileText, Radio, Mic, Volume2, Wand2, BookOpen, Theater, Podcast } from 'lucide-react';

const AiSoundManager: React.FC = () => {
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

  const textToAudioFeatures = [
    {
      icon: Podcast,
      title: "AI Podcast Generation",
      description: "Transform articles into engaging podcast episodes with multiple voice actors",
      image: "https://images.pexels.com/photos/3783471/pexels-photo-3783471.jpeg"
    },
    {
      icon: Theater,
      title: "Audio Drama Creation",
      description: "Convert scripts into immersive audio dramas with character voices and sound effects",
      image: "https://images.pexels.com/photos/2774556/pexels-photo-2774556.jpeg"
    },
    {
      icon: BookOpen,
      title: "Audiobook Narration",
      description: "Turn any text into professional audiobooks with emotional storytelling",
      image: "https://images.pexels.com/photos/3769708/pexels-photo-3769708.jpeg"
    },
    {
      icon: Radio,
      title: "Dynamic Soundscapes",
      description: "Intelligent background music and ambient sound generation",
      image: "https://images.pexels.com/photos/1626481/pexels-photo-1626481.jpeg"
    },
    {
      icon: Volume2,
      title: "Smart Audio Mixing",
      description: "Automated volume control and audio layering for perfect balance",
      image: "https://images.pexels.com/photos/1389429/pexels-photo-1389429.jpeg"
    },
    {
      icon: Wand2,
      title: "Genre Detection",
      description: "AI-powered content analysis for genre-appropriate sound design",
      image: "https://images.pexels.com/photos/3944104/pexels-photo-3944104.jpeg"
    }
  ];

  return (
    <div className="section-container" id="ai-sound-manager" ref={sectionRef}>
      <video className="video-bg" autoPlay loop muted playsInline>
        <source src="https://player.vimeo.com/external/448436027.sd.mp4?s=31c52bd03a3653edc644551ea15a6180729bb2af&profile_id=164" type="video/mp4" />
      </video>
      
      <div className="section-content max-w-7xl mx-auto px-4">
        <div className="glass rounded-lg p-8 md:p-12 max-w-6xl mx-auto">
          <div className="flex items-center mb-6">
            <Music className="w-8 h-8 text-white mr-4" />
            <h2 className="section-title">Dynamic AI Sound Manager</h2>
          </div>
          
          <p className="section-subtitle">
            Transform any text into rich audio content with intelligent genre detection, 
            dynamic soundscapes, and professional-quality mixing.
          </p>

          <div className="mb-16">
            <div className="flex items-center mb-8">
              <FileText className="w-6 h-6 text-white mr-3" />
              <h3 className="text-2xl font-bold">Text-to-Audio Studio</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {textToAudioFeatures.map((feature, index) => (
                <div key={index} className="glass bg-black/40 overflow-hidden group relative h-[300px]">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-75 z-10"></div>
                  <img 
                    src={feature.image}
                    alt={feature.title}
                    className="absolute inset-0 w-full h-full object-cover brightness-75 sepia hue-rotate-180 saturate-150 group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                    <div className="flex items-center space-x-3 mb-2">
                      <feature.icon className="w-6 h-6 text-white" />
                      <h3 className="text-xl font-bold">{feature.title}</h3>
                    </div>
                    <p className="text-white/70">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass bg-black/40 p-8 rounded-lg mb-12">
            <h3 className="text-2xl font-bold mb-6">Intelligent Genre Detection</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Wand2 className="w-6 h-6 text-white" />
                  <p className="text-gray-300">Automatic genre classification for optimal sound design</p>
                </div>
                <div className="flex items-center gap-3">
                  <Radio className="w-6 h-6 text-white" />
                  <p className="text-gray-300">Genre-specific music and sound effect libraries</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Volume2 className="w-6 h-6 text-white" />
                  <p className="text-gray-300">Smart volume mixing and audio layering</p>
                </div>
                <div className="flex items-center gap-3">
                  <Mic className="w-6 h-6 text-white" />
                  <p className="text-gray-300">Multiple voice actors with emotional depth</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-4">
            <button className="cta-button">
              Launch Audio Studio <Music className="w-5 h-5" />
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
    </div>
  );
};

export default AiSoundManager;