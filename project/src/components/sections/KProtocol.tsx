import React, { useEffect, useRef } from "react";
import {
  Network,
  Share2,
  Cpu,
  Database,
  Coins,
  Users,
  Shield,
  Brain,
  Eye,
  Rocket,
  Zap,
  Microscope,
  Dna,
  Glasses,
  Watch,
  Shirt,
} from "lucide-react";

const KProtocol: React.FC = () => {
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

  return (
    <div className="section-container" id="k-protocol" ref={sectionRef}>
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
      <div className="glass rounded-none p-8 md:p-12 border border-white/5 w-full overflow-x-hidden">
        <div className="section-content max-w-7xl mx-auto px-4">
          <div className="flex items-center mb-6">
            <Network className="w-8 h-8 text-white mr-4" />
            <h2 className="section-title">K-Protocol</h2>
          </div>

          <p className="section-subtitle">
            Join our distributed network ecosystem where you can share
            resources, earn tokens, and interact with advanced AI agents in a
            secure, transparent blockchain environment.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="glass bg-black/40 overflow-hidden border border-white/5">
              <img
                src="https://images.pexels.com/photos/8370752/pexels-photo-8370752.jpeg"
                alt="Resource Sharing"
                className="card-image"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">Resource Sharing</h3>
                <p className="text-gray-300">
                  Share computing power, storage, and data securely while
                  earning tokens.
                </p>
                <div className="flex gap-2 mt-3">
                  <Share2 className="w-5 h-5 text-white" />
                  <Cpu className="w-5 h-5 text-white" />
                  <Database className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>

            <div className="glass bg-black/40 overflow-hidden border border-white/5">
              <img
                src="https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg"
                alt="Token Economy"
                className="card-image"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">Token Economy</h3>
                <p className="text-gray-300">
                  Earn tokens backed by real value from ads, computation, and
                  storage.
                </p>
                <div className="flex gap-2 mt-3">
                  <Coins className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>

            <div className="glass bg-black/40 overflow-hidden border border-white/5">
              <img
                src="https://images.pexels.com/photos/7567444/pexels-photo-7567444.jpeg"
                alt="AI Agents"
                className="card-image"
              />
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">
                  AI Agent Protocol
                </h3>
                <p className="text-gray-300">
                  Create and customize AI agents with unique traits and
                  storylines.
                </p>
                <div className="flex gap-2 mt-3">
                  <Users className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6 mb-8">
            <div className="glass bg-black/40 p-6 border border-white/5">
              <h3 className="text-xl font-semibold mb-3">
                Agent Customization
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 border border-white/10 rounded">
                  <h4 className="font-semibold mb-2">Personality Traits</h4>
                  <ul className="text-sm text-gray-300">
                    <li>• Behavioral Patterns</li>
                    <li>• Emotional Responses</li>
                    <li>• Learning Preferences</li>
                  </ul>
                </div>
                <div className="p-4 border border-white/10 rounded">
                  <h4 className="font-semibold mb-2">Skill Trees</h4>
                  <ul className="text-sm text-gray-300">
                    <li>• Specialized Abilities</li>
                    <li>• Evolution Paths</li>
                    <li>• Power Scaling</li>
                  </ul>
                </div>
                <div className="p-4 border border-white/10 rounded">
                  <h4 className="font-semibold mb-2">Lore Integration</h4>
                  <ul className="text-sm text-gray-300">
                    <li>• Rich Backstories</li>
                    <li>• Character Arcs</li>
                    <li>• World Building</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-20 mb-12">
            <div>
              <div className="flex items-center mb-6">
                <Brain className="w-8 h-8 text-white mr-4" />
                <h2 className="text-3xl font-bold">The Pitts</h2>
              </div>

              <p className="text-gray-400 mb-8">
                Pioneering the convergence of biology and technology through
                advanced research and development.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                <div className="glass bg-black/40 overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-75 z-10"></div>
                  <img
                    src="https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg"
                    alt="Bionics and Biomimicry"
                    className="w-full h-48 object-cover brightness-75 sepia hue-rotate-180 saturate-150"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                    <h3 className="text-xl font-bold mb-2">
                      Bionics & Biomimicry
                    </h3>
                    <p className="text-white/70">
                      Advanced prosthetics and nature-inspired engineering
                      solutions
                    </p>
                  </div>
                </div>

                <div className="glass bg-black/40 overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-75 z-10"></div>
                  <img
                    src="https://images.pexels.com/photos/2280547/pexels-photo-2280547.jpeg"
                    alt="Bio Computing"
                    className="w-full h-48 object-cover brightness-75 sepia hue-rotate-180 saturate-150"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                    <h3 className="text-xl font-bold mb-2">Bio Computing</h3>
                    <p className="text-white/70">
                      DNA-based computation and organic processing units
                    </p>
                  </div>
                </div>

                <div className="glass bg-black/40 overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-75 z-10"></div>
                  <img
                    src="https://images.pexels.com/photos/3825527/pexels-photo-3825527.jpeg"
                    alt="Genetic Editing"
                    className="w-full h-48 object-cover brightness-75 sepia hue-rotate-180 saturate-150"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                    <div className="flex items-center space-x-3 mb-2">
                      <Dna className="w-6 h-6 text-white" />
                      <h3 className="text-xl font-bold">Genetic Editing</h3>
                    </div>
                    <p className="text-white/70">
                      Advanced CRISPR technology and genetic optimization
                    </p>
                  </div>
                </div>

                <div className="glass bg-black/40 overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-75 z-10"></div>
                  <img
                    src="https://images.pexels.com/photos/3825537/pexels-photo-3825537.jpeg"
                    alt="Bio Grafting"
                    className="w-full h-48 object-cover brightness-75 sepia hue-rotate-180 saturate-150"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                    <div className="flex items-center space-x-3 mb-2">
                      <Microscope className="w-6 h-6 text-white" />
                      <h3 className="text-xl font-bold">Bio Grafting</h3>
                    </div>
                    <p className="text-white/70">
                      Tissue engineering and regenerative medicine
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center mb-6">
                <Shield className="w-8 h-8 text-white mr-4" />
                <h2 className="text-3xl font-bold">Failsafe</h2>
              </div>

              <p className="text-gray-400 mb-8">
                Advanced security and intelligence systems for next-generation
                technology.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                <div className="glass bg-black/40 overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-75 z-10"></div>
                  <img
                    src="https://images.pexels.com/photos/8386434/pexels-photo-8386434.jpeg"
                    alt="AI Research"
                    className="w-full h-48 object-cover brightness-75 sepia hue-rotate-180 saturate-150"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                    <h3 className="text-xl font-bold mb-2">AI Research</h3>
                    <p className="text-white/70">
                      Advanced neural networks and machine learning systems
                    </p>
                  </div>
                </div>

                <div className="glass bg-black/40 overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-75 z-10"></div>
                  <img
                    src="https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg"
                    alt="Security & Intel"
                    className="w-full h-48 object-cover brightness-75 sepia hue-rotate-180 saturate-150"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                    <h3 className="text-xl font-bold mb-2">Security & Intel</h3>
                    <p className="text-white/70">
                      Advanced cybersecurity and intelligence systems
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center mb-6">
                <Rocket className="w-8 h-8 text-white mr-4" />
                <h2 className="text-3xl font-bold">Hellspawn Protocol</h2>
              </div>

              <p className="text-gray-400 mb-8">
                Pushing the boundaries of technology across multiple industries.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8">
                <div className="glass bg-black/40 overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-75 z-10"></div>
                  <img
                    src="https://images.pexels.com/photos/41162/moon-landing-apollo-11-nasa-buzz-aldrin-41162.jpeg"
                    alt="Space Tech"
                    className="w-full h-48 object-cover brightness-75 sepia hue-rotate-180 saturate-150"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                    <h3 className="text-xl font-bold mb-2">Space Tech</h3>
                    <p className="text-white/70">
                      Advanced propulsion and space exploration systems
                    </p>
                  </div>
                </div>

                <div className="glass bg-black/40 overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-75 z-10"></div>
                  <img
                    src="https://images.pexels.com/photos/730564/pexels-photo-730564.jpeg"
                    alt="Fintech"
                    className="w-full h-48 object-cover brightness-75 sepia hue-rotate-180 saturate-150"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                    <h3 className="text-xl font-bold mb-2">Fintech</h3>
                    <p className="text-white/70">
                      Next-generation financial technology solutions
                    </p>
                  </div>
                </div>

                <div className="glass bg-black/40 overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-75 z-10"></div>
                  <img
                    src="https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg"
                    alt="Smart Tech"
                    className="w-full h-48 object-cover brightness-75 sepia hue-rotate-180 saturate-150"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                    <div className="flex items-center space-x-3 mb-2">
                      <Glasses className="w-6 h-6 text-white" />
                      <h3 className="text-xl font-bold">Smart Tech</h3>
                    </div>
                    <p className="text-white/70">
                      AR glasses and advanced wearable devices
                    </p>
                  </div>
                </div>

                <div className="glass bg-black/40 overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-75 z-10"></div>
                  <img
                    src="https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg"
                    alt="AutoTech"
                    className="w-full h-48 object-cover brightness-75 sepia hue-rotate-180 saturate-150"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                    <div className="flex items-center space-x-3 mb-2">
                      <Watch className="w-6 h-6 text-white" />
                      <h3 className="text-xl font-bold">AutoTech</h3>
                    </div>
                    <p className="text-white/70">
                      Autonomous vehicles and smart transportation
                    </p>
                  </div>
                </div>

                <div className="glass bg-black/40 overflow-hidden group">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-75 z-10"></div>
                  <img
                    src="https://images.pexels.com/photos/7679720/pexels-photo-7679720.jpeg"
                    alt="Fashion Tech"
                    className="w-full h-48 object-cover brightness-75 sepia hue-rotate-180 saturate-150"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                    <div className="flex items-center space-x-3 mb-2">
                      <Shirt className="w-6 h-6 text-white" />
                      <h3 className="text-xl font-bold">Fashion Tech</h3>
                    </div>
                    <p className="text-white/70">
                      Smart fabrics and wearable innovations
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mt-12">
            <button className="cta-button">
              Join Network <Network className="w-4 h-4" />
            </button>
            <button className="cta-button bg-transparent border border-red-800 hover:bg-red-900/20">
              Create Agent <Users className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      <div className="mt-16 max-w-7xl mx-auto px-4">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="w-full rounded-lg shadow-lg"
        >
          <source src="/kprotocol.mp4" type="video/mp4" />
          <p>Your browser doesn't support HTML video.</p>
        </video>
      </div>
    </div>
  );
};

export default KProtocol;
