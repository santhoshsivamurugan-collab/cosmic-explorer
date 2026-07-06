/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PLANETS_DATA } from './data';
import { PlanetData } from './types';
import { SolarSystem3D } from './components/SolarSystem3D';
import { PlanetHUD } from './components/PlanetHUD';
import { ExplorerSection } from './components/ExplorerSection';
import { ComparisonSection } from './components/ComparisonSection';
import { FactsSection } from './components/FactsSection';
import { QuizSection } from './components/QuizSection';

import { 
  Orbit, 
  Map, 
  Scale, 
  Database, 
  Trophy, 
  Compass, 
  Atom, 
  Info,
  ChevronRight,
  Sparkles,
  Layers
} from 'lucide-react';

type NavPage = 'solar_system' | 'explorer' | 'comparison' | 'facts' | 'quiz';

export default function App() {
  const [currentPage, setCurrentPage] = useState<NavPage>('solar_system');
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(null);

  // Geological cross section active index states
  const [structureMode, setStructureMode] = useState(false);
  const [activeLayerIndex, setActiveLayerIndex] = useState(0);

  // Sync state when planet is changed in Solar System
  const handleSelectPlanet = (planet: PlanetData | null) => {
    setSelectedPlanet(planet);
    setStructureMode(false);
    setActiveLayerIndex(0);
  };

  // Reset core status
  const handleDeselectPlanet = () => {
    setSelectedPlanet(null);
    setStructureMode(false);
    setActiveLayerIndex(0);
  };

  // Toggle geological cross sections
  const handleToggleStructure = () => {
    setStructureMode(!structureMode);
    setActiveLayerIndex(0);
  };

  // Quick select planet from dashboard sidebar list
  const handleJumpToPlanet = (planetId: string) => {
    const planet = PLANETS_DATA.find((p) => p.id === planetId);
    if (planet) {
      handleSelectPlanet(planet);
    }
  };

  return (
    <div className="min-h-screen bg-[#050816] text-[#E2E8F0] font-sans flex flex-col relative overflow-x-hidden selection:bg-[#00E5FF]/30 selection:text-[#00E5FF]">
      
      {/* BACKGROUND STAR NOISE OVERLAYS FOR COCKPITS (Only shows up in static dashboard tabs) */}
      {currentPage !== 'solar_system' && (
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/20 via-[#050816]/95 to-[#050816] pointer-events-none z-0">
          {/* Subtle slow twinkling orbital dust mock effect */}
          <div className="absolute top-10 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full filter blur-[100px]" />
          <div className="absolute bottom-12 right-1/4 w-94 h-94 bg-indigo-500/5 rounded-full filter blur-[120px]" />
        </div>
      )}

      {/* FUTURISTIC SPACECRAFT CONTROL CAP BAR (HEADER) */}
      <header 
        id="spacecraft-glass-header" 
        className="sticky top-0 bg-[#0A1128]/75 border-b border-[#00E5FF]/10 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4 backdrop-blur-md z-30 shadow-lg shadow-indigo-950/25"
      >
        {/* APP BRAND TITLE */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center p-2 rounded-xl bg-gradient-to-br from-[#00E5FF]/20 to-indigo-500/10 border border-[#00E5FF]/35">
            <Atom className="text-[#00E5FF] animate-spin text-cyan-300" size={22} style={{ animationDuration: '10s' }} />
            <div className="absolute inset-0 bg-[#00E5FF]/30 rounded-xl filter blur-sm -z-10" />
          </div>
          <div>
            <h1 className="text-xl font-sans font-black tracking-[0.3em] bg-gradient-to-r from-white via-gray-200 to-indigo-300 bg-clip-text text-transparent uppercase">
              COSMIC EXPLORER
            </h1>
            <span className="text-[9px] font-mono text-[#00E5FF] tracking-[0.4em] uppercase block">
              Interplanetary Simulator & System HUD
            </span>
          </div>
        </div>

        {/* SPACECRAFT HUD NAVIGATION LINKS */}
        <nav className="flex items-center flex-wrap gap-1 bg-zinc-950/45 p-1 rounded-xl border border-white/5">
          {[
            { id: 'solar_system', label: 'Solar System', icon: <Orbit size={14} /> },
            { id: 'explorer', label: 'Planet Explorer', icon: <Map size={14} /> },
            { id: 'comparison', label: 'Planet Comparison', icon: <Scale size={14} /> },
            { id: 'facts', label: 'Space Facts Center', icon: <Database size={14} /> },
            { id: 'quiz', label: 'Space Quiz', icon: <Trophy size={14} /> },
          ].map((tab) => {
            const isActive = currentPage === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setCurrentPage(tab.id as NavPage);
                  // Auto deselect on shift page to preserve memory rendering
                  if (tab.id !== 'solar_system') {
                    handleDeselectPlanet();
                  }
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-mono transition-all duration-200 cursor-pointer ${
                  isActive 
                    ? 'bg-[#00E5FF]/20 text-[#00E5FF] font-bold border border-[#00E5FF]/40 shadow-inner' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
                id={`nav-${tab.id}`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </header>

      {/* COMPONENT BODY */}
      <main className="flex-1 w-full relative z-10 flex flex-col p-4 md:p-6 lg:p-8 max-w-7xl mx-auto">
        
        {/* INTERACTIVE COMPONENT SWITCHBOARD */}

        {/* SECTION 1: SOLAR SYSTEM VIEW */}
        {currentPage === 'solar_system' && (
          <div className="absolute inset-0 flex flex-col z-0 overflow-hidden" id="solar-system-view-parent">
            {/* Standard full width renderer */}
            <div className="w-full h-full relative" id="threejs-ambient-viewport">
              <SolarSystem3D
                selectedPlanet={selectedPlanet}
                onSelectPlanet={handleSelectPlanet}
                structureMode={structureMode}
                activeLayerIndex={activeLayerIndex}
                onSelectLayer={setActiveLayerIndex}
              />

              {/* FLOATING TARGET LOCATOR SIDEBAR OVERLAY (Quick travel sidebar) */}
              <div 
                id="floating-navigation-caps" 
                className="absolute top-6 left-6 bg-[#0A1128]/70 border border-[#00E5FF]/10 p-3.5 rounded-xl backdrop-blur-md text-white select-none hidden lg:flex flex-col space-y-2.5 max-w-[190px] shadow-2xl z-20 transition-all hover:border-[#00E5FF]/30"
              >
                <div className="text-[10px] font-mono tracking-widest text-[#00E5FF] border-b border-white/10 pb-1.5 uppercase font-bold flex items-center gap-1.5">
                  <Compass size={11} className="text-cyan-400" /> System Radars
                </div>
                
                {/* Reset entire view trigger */}
                <button
                  onClick={handleDeselectPlanet}
                  className={`text-left text-[11px] p-2 rounded-lg font-mono tracking-wide flex items-center justify-between transition-all ${
                    !selectedPlanet 
                      ? 'bg-[#00E5FF]/15 text-[#00E5FF] border border-[#00E5FF]/35 font-bold' 
                      : 'bg-white/5 border border-transparent text-gray-400 hover:text-white hover:bg-white/10'
                  }`}
                  id="target-sun-btn"
                >
                  <span>☉ Solar Orbit View</span>
                  <ChevronRight size={10} />
                </button>

                {/* Individual planet jump points */}
                <div className="space-y-1">
                  {PLANETS_DATA.map((planet) => {
                    const isSelected = selectedPlanet?.id === planet.id;
                    return (
                      <button
                        key={planet.id}
                        onClick={() => handleJumpToPlanet(planet.id)}
                        className={`w-full text-left p-2 rounded-lg text-xs font-mono transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/45 font-bold'
                            : 'bg-white/5 border border-transparent text-gray-400 hover:text-white hover:bg-zinc-900/60'
                        }`}
                        id={`target-jump-${planet.id}`}
                      >
                        <span className="flex items-center gap-2">
                          <span 
                            className="inline-block w-2.5 h-2.5 rounded-full border border-white/20"
                            style={{ backgroundColor: planet.colorHex }}
                          />
                          {planet.name}
                        </span>
                        <ChevronRight size={9} />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* SCI-FI INTERACTIVE COCKPIT TELEMETRY HUD OVERLAY */}
              {selectedPlanet && (
                <PlanetHUD
                  planet={selectedPlanet}
                  onClose={handleDeselectPlanet}
                  structureMode={structureMode}
                  onToggleStructure={handleToggleStructure}
                  activeLayerIndex={activeLayerIndex}
                  onSelectLayer={setActiveLayerIndex}
                />
              )}
            </div>
          </div>
        )}

        {/* SECTION 2: COSMIC EXPLORER ENCYCLOPEDIA */}
        {currentPage === 'explorer' && (
          <div className="py-4 w-full">
            <ExplorerSection />
          </div>
        )}

        {/* SECTION 3: FLIGHT DECK COMPARISON METRICS */}
        {currentPage === 'comparison' && (
          <div className="py-4 w-full">
            <ComparisonSection />
          </div>
        )}

        {/* SECTION 4: ARCHIVE DATA LOG VAULTS */}
        {currentPage === 'facts' && (
          <div className="py-4 w-full">
            <FactsSection />
          </div>
        )}

        {/* SECTION 5: GAMIFIED SPACE QUIZ FLIGHT EXAMS */}
        {currentPage === 'quiz' && (
          <div className="py-4 w-full">
            <QuizSection />
          </div>
        )}

      </main>

      {/* FOOTER CONTROLS COCKPIT FOOTING */}
      {currentPage !== 'solar_system' && (
        <footer className="border-t border-white/5 px-6 py-4 mt-auto relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500 bg-[#050816]">
          <div className="font-mono">
            COSMIC EXPLORER &trade; &copy; 2026. ALL TELEMETRY CHANNELS FULLY OPERATIONAL.
          </div>
          <div className="flex gap-4 font-mono text-[10px] text-gray-400">
            <span>Uptime: SECURED</span>
            <span>Sensor: ONLINE</span>
            <span>Orbital Stage: 1</span>
          </div>
        </footer>
      )}
    </div>
  );
}
