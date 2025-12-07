import React, { useState } from 'react';
import { SceneConfig, ShapeType, MaterialType } from '../types';
import { generateThemeFromPrompt } from '../services/geminiService';
import { Wand2, Loader2, RefreshCcw, Layers, Palette, Lightbulb } from 'lucide-react';

interface ControlPanelProps {
  config: SceneConfig;
  setConfig: React.Dispatch<React.SetStateAction<SceneConfig>>;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ config, setConfig }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiMessage, setAiMessage] = useState<string | null>(null);

  const handleAiGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setAiMessage(null);
    
    const result = await generateThemeFromPrompt(prompt);
    
    if (result && result.config) {
      setConfig(prev => ({ ...prev, ...result.config }));
      setAiMessage(`Applied theme: ${result.themeName}`);
    } else {
        setAiMessage("Failed to generate theme. Try a different prompt.");
    }
    
    setIsGenerating(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setConfig(prev => ({
      ...prev,
      [name]: type === 'number' || (e.target as HTMLInputElement).type === 'range' ? parseFloat(value) : value
    }));
  };

  return (
    <div className="absolute top-0 right-0 h-full w-full md:w-96 bg-black/40 backdrop-blur-xl border-l border-white/10 p-6 overflow-y-auto transition-all duration-300 z-10 text-sm">
      <div className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 rounded bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Layers className="text-white w-5 h-5" />
        </div>
        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
          Prism Designer
        </h1>
      </div>

      {/* AI Section */}
      <div className="mb-8 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-purple-500/50 transition-colors">
        <label className="block text-xs font-semibold text-purple-300 mb-2 uppercase tracking-wider flex items-center gap-2">
            <Wand2 className="w-3 h-3" />
            AI Theme Generator
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., Cyberpunk City, Calm Ocean..."
            className="w-full bg-black/50 border border-white/20 rounded px-3 py-2 text-white focus:outline-none focus:border-purple-500 placeholder-gray-500"
            onKeyDown={(e) => e.key === 'Enter' && handleAiGenerate()}
          />
          <button
            onClick={handleAiGenerate}
            disabled={isGenerating || !prompt}
            className="bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-3 py-2 rounded transition-all flex items-center justify-center min-w-[44px]"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
          </button>
        </div>
        {aiMessage && <p className="text-xs text-green-400 mt-2">{aiMessage}</p>}
      </div>

      <div className="space-y-6">
        {/* Geometry Config */}
        <div>
          <h3 className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider flex items-center gap-2">
            <RefreshCcw className="w-3 h-3" /> Geometry
          </h3>
          <div className="grid grid-cols-2 gap-4">
             <div className="col-span-2">
                <label className="block text-xs text-gray-500 mb-1">Shape</label>
                <select
                    name="shape"
                    value={config.shape}
                    onChange={handleInputChange}
                    className="w-full bg-black/30 border border-white/10 rounded px-2 py-2 text-white focus:border-purple-500 outline-none"
                >
                    {Object.values(ShapeType).map(s => (
                    <option key={s} value={s}>{s}</option>
                    ))}
                </select>
            </div>
            
            <div className="col-span-2">
                <label className="block text-xs text-gray-500 mb-1">Scale: {config.scale.toFixed(1)}</label>
                <input
                    type="range"
                    name="scale"
                    min="0.5"
                    max="3"
                    step="0.1"
                    value={config.scale}
                    onChange={handleInputChange}
                    className="w-full accent-purple-500 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                />
            </div>

             <div className="col-span-2">
                <label className="block text-xs text-gray-500 mb-1">Rotation Speed: {config.rotationSpeed.toFixed(1)}</label>
                <input
                    type="range"
                    name="rotationSpeed"
                    min="0"
                    max="5"
                    step="0.1"
                    value={config.rotationSpeed}
                    onChange={handleInputChange}
                    className="w-full accent-purple-500 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                />
            </div>
          </div>
        </div>

        {/* Material Config */}
        <div>
          <h3 className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider flex items-center gap-2">
            <Palette className="w-3 h-3" /> Material
          </h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
                <label className="block text-xs text-gray-500 mb-1">Type</label>
                 <select
                    name="material"
                    value={config.material}
                    onChange={handleInputChange}
                    className="w-full bg-black/30 border border-white/10 rounded px-2 py-2 text-white focus:border-purple-500 outline-none"
                >
                    {Object.values(MaterialType).map(m => (
                    <option key={m} value={m}>{m}</option>
                    ))}
                </select>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
                 <div>
                    <label className="block text-xs text-gray-500 mb-1">Color</label>
                    <div className="flex items-center gap-2">
                        <input
                            type="color"
                            name="color"
                            value={config.color}
                            onChange={handleInputChange}
                            className="w-8 h-8 rounded border-none cursor-pointer bg-transparent"
                        />
                        <span className="text-xs text-gray-400">{config.color}</span>
                    </div>
                 </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Bg Color</label>
                    <div className="flex items-center gap-2">
                        <input
                            type="color"
                            name="bgColor"
                            value={config.bgColor}
                            onChange={handleInputChange}
                            className="w-8 h-8 rounded border-none cursor-pointer bg-transparent"
                        />
                         <span className="text-xs text-gray-400">{config.bgColor}</span>
                    </div>
                 </div>
            </div>

            <div>
                <label className="block text-xs text-gray-500 mb-1">Metalness: {config.metalness.toFixed(2)}</label>
                <input
                    type="range"
                    name="metalness"
                    min="0"
                    max="1"
                    step="0.05"
                    value={config.metalness}
                    onChange={handleInputChange}
                    className="w-full accent-blue-500 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                />
            </div>
            <div>
                <label className="block text-xs text-gray-500 mb-1">Roughness: {config.roughness.toFixed(2)}</label>
                <input
                    type="range"
                    name="roughness"
                    min="0"
                    max="1"
                    step="0.05"
                    value={config.roughness}
                    onChange={handleInputChange}
                    className="w-full accent-blue-500 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer"
                />
            </div>
          </div>
        </div>
        
        {/* Lighting Config */}
        <div>
          <h3 className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider flex items-center gap-2">
            <Lightbulb className="w-3 h-3" /> Lighting
          </h3>
          <div className="grid grid-cols-1 gap-4">
             <div className="grid grid-cols-2 gap-2">
                <div>
                     <label className="block text-xs text-gray-500 mb-1">Light Color</label>
                    <div className="flex items-center gap-2">
                        <input
                            type="color"
                            name="lightColor"
                            value={config.lightColor}
                            onChange={handleInputChange}
                            className="w-8 h-8 rounded border-none cursor-pointer bg-transparent"
                        />
                         <span className="text-xs text-gray-400">{config.lightColor}</span>
                    </div>
                </div>
                <div>
                    <label className="block text-xs text-gray-500 mb-1">Intensity: {config.lightIntensity.toFixed(1)}</label>
                     <input
                    type="range"
                    name="lightIntensity"
                    min="0"
                    max="5"
                    step="0.1"
                    value={config.lightIntensity}
                    onChange={handleInputChange}
                    className="w-full accent-yellow-500 h-1 bg-white/10 rounded-lg appearance-none cursor-pointer mt-2"
                />
                </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ControlPanel;