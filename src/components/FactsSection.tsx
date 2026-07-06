/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SpaceFact } from '../types';
import { SPACE_FACTS } from '../data';
import { Database, Search, Sparkles, Filter, Info, Sun, Star, Compass, Rocket } from 'lucide-react';

export const FactsSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | SpaceFact['category']>('all');
  const [randomFact, setRandomFact] = useState<SpaceFact | null>(SPACE_FACTS[0]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Filter logic
  const filteredFacts = SPACE_FACTS.filter((fact) => {
    const matchesSearch = 
      fact.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fact.text.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeCategory === 'all') return matchesSearch;
    return matchesSearch && fact.category === activeCategory;
  });

  // Random Fact Generator
  const generateRandomFact = () => {
    setIsGenerating(true);
    
    // Simulate beautiful matrix-like console decryption
    setTimeout(() => {
      let filteredPool = SPACE_FACTS;
      if (activeCategory !== 'all') {
        filteredPool = SPACE_FACTS.filter((f) => f.category === activeCategory);
      }
      
      // Grab random card
      const randomIndex = Math.floor(Math.random() * filteredPool.length);
      setRandomFact(filteredPool[randomIndex] || SPACE_FACTS[0]);
      setIsGenerating(false);
    }, 450);
  };

  const getCategoryIcon = (category: SpaceFact['category']) => {
    switch (category) {
      case 'sun': return <Sun size={14} className="text-amber-400" />;
      case 'planet': return <Star size={14} className="text-emerald-400" />;
      case 'system': return <Compass size={14} className="text-[#00E5FF]" />;
      default: return <Rocket size={14} className="text-rose-400" />;
    }
  };

  return (
    <div id="facts-panel" className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-white select-none">
      
      {/* LEFT SIDEBAR: FACT SEARCH & DIRECTORY */}
      <div className="lg:col-span-5 bg-[#0A1128]/85 border border-[#00E5FF]/10 rounded-2xl p-5 backdrop-blur-md flex flex-col space-y-4 max-h-[80vh] overflow-y-auto">
        <div className="space-y-1">
          <h3 className="text-xl font-semibold text-gray-100 flex items-center gap-2">
            <Database className="text-[#00E5FF]" size={20} />
            Data Fact Vaults
          </h3>
          <p className="text-xs text-gray-400 font-mono">Dossier logs harvested by autonomous deep deep probes</p>
        </div>

        {/* SEARCH BOX */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search archival telemetry logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm font-mono focus:outline-none focus:border-[#00E5FF]/50 transition-colors"
            id="facts-search-input"
          />
        </div>

        {/* CATEGORY SELECTORS */}
        <div className="space-y-1">
          <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest pl-1 select-none block">ARCHIVE DIRECTORY</span>
          <div className="grid grid-cols-1 gap-1.5 pt-1">
            {[
              { id: 'all', label: 'All Telemetry Dossiers', icon: <Database size={13} /> },
              { id: 'planet', label: 'Planetary Anomalies', icon: <Star size={13} className="text-emerald-400" /> },
              { id: 'sun', label: 'Solar Nucleus Profiles', icon: <Sun size={13} className="text-amber-400" /> },
              { id: 'system', label: 'Heliospheric Mechanics', icon: <Compass size={13} className="text-[#00E5FF]" /> },
              { id: 'mission', label: 'Voyager & Robotic Plumes', icon: <Rocket size={13} className="text-rose-400" /> },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id as any);
                  // Grab matching random fact
                  const subset = cat.id === 'all' ? SPACE_FACTS : SPACE_FACTS.filter(f => f.category === cat.id);
                  setRandomFact(subset[0] || SPACE_FACTS[0]);
                }}
                className={`w-full text-left p-3.5 rounded-xl border flex items-center gap-3 transition-colors ${
                  activeCategory === cat.id
                    ? 'bg-[#00E5FF]/10 border-[#00E5FF]/40 text-white font-bold font-mono'
                    : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10 hover:text-white font-mono'
                }`}
                id={`facts-cat-btn-${cat.id}`}
              >
                {cat.icon}
                <span className="text-xs">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT DISPLAY: COMMAND ENGINE DEEP-SPACE RANDOMizer */}
      <div className="lg:col-span-7 flex flex-col space-y-6">
        
        {/* HYPER ROTATION GENERATOR TRAY */}
        <div className="bg-[#00E5FF]/5 border border-[#00E5FF]/15 rounded-3xl p-6 relative overflow-hidden backdrop-blur-md flex flex-col items-center justify-center text-center py-10">
          
          <div className="absolute top-4 left-4 bg-white/5 border border-[#00E5FF]/20 text-[#00E5FF] rounded px-2 py-0.5 text-[9px] font-mono tracking-widest uppercase">
            HOLOGRAPHIC COGNITIVE MODULE
          </div>

          <div className="bg-zinc-950/45 p-6 rounded-2xl border border-white/10 w-full max-w-lg space-y-4 shadow-xl shadow-cyan-950/25 relative">
            {randomFact ? (
              <div 
                className={`space-y-3 transition-all duration-300 ${isGenerating ? 'opacity-25 scale-95 blur-[2px]' : 'opacity-100 scale-100'}`}
                id="facts-random-display-card"
              >
                <div className="flex items-center justify-center gap-2">
                  {getCategoryIcon(randomFact.category)}
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#00E5FF]">{randomFact.categoryLabel}</span>
                </div>
                <h4 className="text-2xl font-bold font-sans text-gray-100">{randomFact.title}</h4>
                <p className="text-xs text-gray-300 leading-relaxed font-mono px-4 select-text">
                  "{randomFact.text}"
                </p>
              </div>
            ) : (
              <p className="text-xs text-gray-400 italic">Initiate decrypter core above...</p>
            )}
          </div>

          <button
            onClick={generateRandomFact}
            disabled={isGenerating}
            className="mt-6 flex items-center gap-2 px-6 py-3 font-mono bg-gradient-to-r from-[#00E5FF] to-indigo-500 text-[#050816] font-bold rounded-xl text-xs hover:opacity-90 hover:scale-105 active:scale-95 transition-all outline-none border border-transparent shadow-lg shadow-cyan-500/10 cursor-pointer disabled:opacity-50"
            id="facts-randomize-btn"
          >
            <Sparkles size={14} className={isGenerating ? 'animate-spin' : ''} />
            {isGenerating ? 'DECRYPTING DOSSIER MATRIX...' : 'DECRYPT RANDOM INSIGHT'}
          </button>
        </div>

        {/* VAULT DIRECTORY SEARCH RESULTS */}
        <div className="bg-[#0A1128]/85 border border-[#00E5FF]/10 rounded-2xl p-6 backdrop-blur-md">
          <h4 className="text-sm font-semibold border-b border-white/10 pb-3 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Filter size={15} className="text-[#00E5FF]" /> Index Search Dossiers List
            </span>
            <span className="text-[10px] text-gray-400 font-mono">Found {filteredFacts.length} logs</span>
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
            {filteredFacts.map((fact) => (
              <div 
                key={fact.id} 
                className="bg-white/5 border border-white/5 rounded-xl p-4.5 space-y-2.5 hover:border-[#00E5FF]/25 transition-all duration-200"
                id={`facts-item-${fact.id}`}
              >
                <div className="flex items-center justify-between border-b border-white/15 pb-1">
                  <span className="font-semibold text-xs tracking-wide text-[#00E5FF] font-sans">
                    {fact.title}
                  </span>
                  <span className="text-[9px] font-mono text-gray-400 uppercase">
                    {fact.categoryLabel}
                  </span>
                </div>
                <p className="text-[11px] text-gray-300 leading-relaxed font-mono">
                  {fact.text}
                </p>
              </div>
            ))}
            {filteredFacts.length === 0 && (
              <div className="text-center py-8 text-xs text-gray-400 italic col-span-2">
                No archived telemetry dossiers match your filter/search criteria.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
