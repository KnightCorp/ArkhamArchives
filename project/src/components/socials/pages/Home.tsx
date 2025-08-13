import React from 'react';
import { Book, Brain, Trophy, Video, Mail } from 'lucide-react';

const Home = () => {
  return (
    <div className="max-w-7xl mx-auto dark-academia-gradient min-h-screen p-8 rounded-lg">
      {/* Hero Section */}
      <section className="text-center space-y-6 mb-16">
        <h1 className="text-6xl text-silver academia-text font-light tracking-wide">
          The Archives
        </h1>
        <p className="text-2xl text-silver/80 max-w-3xl mx-auto academia-text italic">
          Where knowledge meets noir. Explore our curated collection of learning paths, from cutting-edge technology to classical literature and academic excellence.
        </p>
      </section>

      {/* Mission Section */}
      <section className="bg-[#1a0f0f]/90 rounded-lg p-8 border border-[#8B0000]/30 academia-border mb-16">
        <h2 className="text-4xl text-silver academia-text font-light tracking-wide mb-4">Our Mission</h2>
        <p className="text-xl text-silver/80 academia-text italic leading-relaxed">
          In the shadowed halls of academia, we forge the minds of tomorrow. The Archives stands as a beacon for those who seek knowledge in its purest form, where classical wisdom meets cutting-edge innovation.
        </p>
      </section>

      {/* Student Experience */}
      <section className="space-y-8 mb-16">
        <h2 className="text-4xl text-silver academia-text font-light tracking-wide">The Student Experience</h2>
        
        <div className="aspect-video relative rounded-lg overflow-hidden academia-border">
          <img 
            src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&h=600&fit=crop" 
            alt="Student Experience"
            className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all"
          />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <button className="px-8 py-4 bg-[#1a0f0f]/90 text-silver rounded-lg hover:bg-[#1a0f0f] transition-colors flex items-center space-x-3 text-lg academia-text border border-[#8B0000]/30">
              <Video className="w-6 h-6" />
              <span>Watch Introduction (5:30)</span>
            </button>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="space-y-8 mb-16">
        <h2 className="text-4xl text-silver academia-text font-light tracking-wide">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#1a0f0f]/90 rounded-lg p-8 border border-[#8B0000]/30 academia-border">
            <Brain className="w-10 h-10 text-silver mb-4" />
            <h3 className="text-2xl text-silver academia-text font-light mb-2">Adaptive Learning</h3>
            <p className="text-lg text-silver/80 academia-text italic">
              AI-powered pathways that evolve with your progress
            </p>
          </div>
          <div className="bg-[#1a0f0f]/90 rounded-lg p-8 border border-[#8B0000]/30 academia-border">
            <Book className="w-10 h-10 text-silver mb-4" />
            <h3 className="text-2xl text-silver academia-text font-light mb-2">Collaborative Projects</h3>
            <p className="text-lg text-silver/80 academia-text italic">
              Join forces with fellow scholars on real-world challenges
            </p>
          </div>
          <div className="bg-[#1a0f0f]/90 rounded-lg p-8 border border-[#8B0000]/30 academia-border">
            <Trophy className="w-10 h-10 text-silver mb-4" />
            <h3 className="text-2xl text-silver academia-text font-light mb-2">Gamified Progress</h3>
            <p className="text-lg text-silver/80 academia-text italic">
              Earn rewards and unlock achievements as you learn
            </p>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-[#1a0f0f]/90 rounded-lg p-8 border border-[#8B0000]/30 academia-border">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <h2 className="text-4xl text-silver academia-text font-light tracking-wide">Stay Informed</h2>
          <p className="text-xl text-silver/80 academia-text italic">
            Subscribe to our weekly digest of academic excellence.
          </p>
          <div className="flex space-x-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-[#0a0505] border border-[#8B0000]/30 rounded-lg text-silver placeholder-silver/40 text-lg academia-text"
            />
            <button className="px-8 py-3 bg-[#1a0f0f] text-silver border border-[#8B0000]/30 rounded-lg hover:bg-[#1a0f0f]/80 transition-colors flex items-center space-x-3 text-lg academia-text">
              <Mail className="w-6 h-6" />
              <span>Subscribe</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;