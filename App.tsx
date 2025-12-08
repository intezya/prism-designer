import React, { useState, useRef, useEffect } from 'react';
import Scene3D from './components/Scene3D';
import ControlPanel from './components/ControlPanel';
import { SceneConfig, ShapeType, MaterialType } from './types';
import { Menu, X } from 'lucide-react';

const INITIAL_CONFIG: SceneConfig = {
  shape: ShapeType.Icosahedron,
  color: '#8b5cf6',
  metalness: 0.1,
  roughness: 0.2,
  rotationSpeed: 0.5,
  scale: 1.5,
  material: MaterialType.Physical,
  bgColor: '#0f0f13',
  lightColor: '#ffffff',
  lightIntensity: 1.5
};

const App: React.FC = () => {
  const [config, setConfig] = useState<SceneConfig>(INITIAL_CONFIG);
  const [isSidebarOpen, setSidebarOpen] = useState(false); // Closed by default for better view
  const scrollProgress = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      // Calculate normalized progress (0 to 1)
      const maxScroll = scrollHeight - clientHeight;
      const progress = maxScroll > 0 ? scrollTop / maxScroll : 0;
      scrollProgress.current = progress;
    }
  };

  return (
    <div className="w-full h-screen relative overflow-hidden bg-black text-white font-sans selection:bg-purple-500/30">
      
      {/* 3D Scene Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Scene3D config={config} scrollProgress={scrollProgress} />
      </div>

      {/* Scrollable Content */}
      <div 
        ref={containerRef}
        onScroll={handleScroll}
        className="absolute inset-0 z-10 overflow-y-scroll snap-y snap-mandatory scroll-smooth hide-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <style>{`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {/* Section 1: Mesh Right, Text Left */}
        <section className="h-screen w-full snap-start flex items-center p-8 md:p-20">
          <div className="max-w-xl">
             <h2 className="text-6xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500 mb-6">
               Abstract Beauty
             </h2>
             <p className="text-lg text-gray-400 font-light leading-relaxed">
               Discover the power of generative 3D design. A fusion of geometry, light, and material that responds to your creativity.
             </p>
          </div>
        </section>

        {/* Section 2: Mesh Left, Text Right */}
        <section className="h-screen w-full snap-start flex items-center justify-end p-8 md:p-20 text-right">
           <div className="max-w-xl">
             <h2 className="text-6xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-l from-white to-purple-400 mb-6">
               Geometric Harmony
             </h2>
             <p className="text-lg text-gray-400 font-light leading-relaxed">
               Control the chaos. Adjust materials, tweak the lighting, and find the perfect balance for your digital masterpiece.
             </p>
          </div>
        </section>

        {/* Section 3: Mesh Center, Text Center */}
        <section className="h-screen w-full snap-start flex flex-col items-center justify-end pb-32 p-8 text-center">
           <div className="max-w-2xl">
             <h2 className="text-5xl md:text-7xl font-bold text-white mb-6">
               Pure Form
             </h2>
             <p className="text-lg text-gray-400 font-light max-w-lg mx-auto">
               Ready to create? Open the controls and let AI generate your next visual theme.
             </p>
          </div>
        </section>
      </div>

      {/* Mobile Toggle Button */}
      <button 
        onClick={() => setSidebarOpen(!isSidebarOpen)}
        className="absolute top-4 right-4 z-20 p-2 bg-black/50 backdrop-blur rounded-lg border border-white/10 text-white hover:bg-white/10 transition-colors"
      >
        {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar Controls */}
      <div className={`fixed inset-y-0 right-0 w-full md:w-96 z-30 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <ControlPanel config={config} setConfig={setConfig} />
      </div>

    </div>
  );
};

export default App;
