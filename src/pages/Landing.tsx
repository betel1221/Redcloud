import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Network, Shield, Zap, ChevronRight, Activity } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-black overflow-hidden flex flex-col font-sans selection:bg-white selection:text-black">
      {/* Navbar */}
      <nav className="w-full max-w-7xl mx-auto px-6 py-6 flex justify-between items-center relative z-20">
        <div className="flex items-center space-x-2">
          <Activity className="w-8 h-8 text-[#DC2626]" />
          <span className="text-xl font-bold tracking-widest uppercase">Redhelp</span>
        </div>
        <button 
          onClick={() => navigate('/login')}
          className="px-6 py-2 border border-[#FECACA] rounded-md hover:bg-[#DC2626]/5 transition-all duration-300 font-medium text-sm text-black"
        >
          Sign In
        </button>
      </nav>

      {/* Hero Section */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 relative z-10 text-center">
        <div className="animate-slide-up z-10 max-w-4xl">
          <div className="inline-flex items-center px-3 py-1 rounded-full border border-[#FECACA] bg-[#F9FAFB] mb-8">
            <span className="w-2 h-2 rounded-full bg-success mr-2 animate-pulse"></span>
            <span className="text-xs font-medium tracking-wide text-[#4B5563] uppercase">Welcome to Redhelp</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-8 text-black">
            Intelligence.<br />
            Operations. <br />
            Absolute Control.
          </h1>
          
          <p className="text-lg md:text-xl text-[#4B5563] mb-12 max-w-2xl mx-auto leading-relaxed">
            The next generation Enterprise RAG AI Operations Platform. Monitor, scale, and secure your autonomous infrastructure with unprecedented clarity.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <button 
              onClick={() => navigate('/login')}
              className="group px-8 py-4 bg-[#DC2626] text-white rounded-md font-bold text-lg hover:bg-[#B91C1C] transition-all duration-300 flex items-center"
            >
              Access Dashboard
              <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-32 z-10">
          <div className="bg-[#F9FAFB] p-8 text-left group hover:-translate-y-2 transition-all duration-300 border border-[#FECACA] rounded-lg">
            <div className="w-12 h-12 rounded-2xl bg-[#DC2626]/5 flex items-center justify-center mb-6 border border-[#DC2626]/10 group-hover:bg-[#DC2626]/10 transition-colors">
              <Zap className="w-6 h-6 text-black" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-black">Real-time Telemetry</h3>
            <p className="text-[#4B5563] text-sm leading-relaxed">Instant insights into CPU, Memory, and AI Inference latency with zero delay.</p>
          </div>
          <div className="bg-[#F9FAFB] p-8 text-left group hover:-translate-y-2 transition-all duration-300 border border-[#FECACA] rounded-lg">
            <div className="w-12 h-12 rounded-2xl bg-[#DC2626]/5 flex items-center justify-center mb-6 border border-[#DC2626]/10 group-hover:bg-[#DC2626]/10 transition-colors">
              <Shield className="w-6 h-6 text-black" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-black">Threat Mitigation</h3>
            <p className="text-[#4B5563] text-sm leading-relaxed">Enterprise-grade security monitoring with automated intrusion response protocols.</p>
          </div>
          <div className="bg-[#F9FAFB] p-8 text-left group hover:-translate-y-2 transition-all duration-300 border border-[#FECACA] rounded-lg">
            <div className="w-12 h-12 rounded-2xl bg-[#DC2626]/5 flex items-center justify-center mb-6 border border-[#DC2626]/10 group-hover:bg-[#DC2626]/10 transition-colors">
              <Network className="w-6 h-6 text-black" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-black">Distributed RAG</h3>
            <p className="text-[#4B5563] text-sm leading-relaxed">Seamless orchestration of multi-vector databases across global regions.</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 text-center text-textSecondary text-sm z-10 border-t border-[#DC2626]/10 mt-20">
        <p>&copy; 2026 Redhelp All rights reserved.</p>
      </footer>
    </div>
  );
}
