import React from 'react';
import { Shield } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title }) => {
  return (
    <div className="section-container bg-black min-h-screen">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-gray-900/20 via-black to-black"></div>
        <video className="video-bg" autoPlay loop muted playsInline>
          <source src="https://player.vimeo.com/external/452246181.sd.mp4?s=6e1e0c42d9d1b2f25e5e5b6d0c3b187f9f484e0e&profile_id=164" type="video/mp4" />
        </video>
      </div>
      
      <div className="section-content max-w-[1920px] mx-auto flex flex-col justify-center items-end min-h-screen pr-8">
        <div className="auth-glass rounded-none p-12 max-w-md w-full relative overflow-hidden">
          <div className="relative">
            <div className="flex items-center justify-center mb-12">
              <Shield className="w-16 h-16 text-white mr-6" />
              <h1 className="text-4xl font-black uppercase tracking-widest text-white">{title}</h1>
            </div>
            
            <div className="relative">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;