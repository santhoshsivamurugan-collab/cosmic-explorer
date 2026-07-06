/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PlanetData } from '../types';
import { Layers, Thermometer, Orbit, Scale, Target, Sun, Moon, Info, Sparkles } from 'lucide-react';

interface PlanetHUDProps {
  planet: PlanetData;
  onClose: () => void;
  structureMode: boolean;
  onToggleStructure: () => void;
  activeLayerIndex: number;
  onSelectLayer: (index: number) => void;
}

export const PlanetHUD: React.FC<PlanetHUDProps> = ({
  planet,
  onClose,
  structureMode,
  onToggleStructure,
  activeLayerIndex,
  onSelectLayer,
}) => {
  return (
    <div 
      id={`hud-${planet.id}`} 
      className="absolute top-6 right-6 bottom-6 w-full max-w-sm sm:max-w-md bg-[#0A1128]/75 border border-[#00E5FF]/20 rounded-2xl backdrop-blur-lg shadow-2xl text-white flex flex-col overflow-y-auto select-none z-10 animate-fade-in pointer-events-auto"
    >
      {/* HUD HEADER */}
      <div className="border-b border-[#00E5FF]/20 px-6 py-4 flex items-center justify-between sticky top-0 bg-[#0A1128]/90 z-20">
        <div>
          <span className="text-[10px] tracking-[0.3em] text-[#00E5FF] font-mono block">ORBITAL TARGET REPORT</span>
          <h2 className="text-3xl font-sans tracking-wide font-medium flex items-center gap-2">
            {planet.name}
            <span className={`w-3 h-3 rounded-full bg-${planet.color}`} />
          </h2>
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white border border-white/15 hover:border-white/30 rounded px-2.5 py-1 text-xs font-mono transition-all duration-150"
          id="hud-close-btn"
        >
          DESELECT
        </button>
      </div>

      <div className="p-6 space-y-6 flex-1">
        {/* TELEMETRY READOUT GRID */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col justify-between">
            <span className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
              <Sun size={11} className="text-amber-400" /> DISTANCE FROM SUN
            </span>
            <span className="text-sm font-semibold tracking-wide text-gray-200 mt-1">{planet.distanceFromSun}</span>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col justify-between">
            <span className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
              <Scale size={11} className="text-[#00E5FF]" /> PLANETARY DIAMETER
            </span>
            <span className="text-sm font-semibold tracking-wide text-gray-200 mt-1">{planet.diameter}</span>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col justify-between">
            <span className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
              <Target size={11} className="text-rose-400" /> SURFACE GRAVITY
            </span>
            <span className="text-sm font-semibold tracking-wide text-gray-200 mt-1">{planet.gravity}</span>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col justify-between">
            <span className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
              <Thermometer size={11} className="text-amber-500" /> SURFACE TEMP
            </span>
            <span className={`text-sm font-semibold tracking-wide mt-1 ${planet.id === 'venus' ? 'text-rose-400' : 'text-cyan-300'}`}>
              {planet.temperature}
            </span>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col justify-between">
            <span className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
              <Orbit size={11} className="text-[#00E5FF]" /> ORBITAL PERIOD
            </span>
            <span className="text-sm font-semibold tracking-wide text-gray-200 mt-1">{planet.orbitalPeriod}</span>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col justify-between">
            <span className="text-[10px] text-gray-400 font-mono flex items-center gap-1">
              <Orbit size={11} className="text-indigo-400" /> ROTATIONAL PERIOD
            </span>
            <span className="text-sm font-semibold tracking-wide text-gray-200 mt-1">{planet.rotationPeriod}</span>
          </div>
        </div>

        {/* SCI-FI INTERACTIVE STRUCTURE MODE COMPONENT */}
        <div className="border border-[#00E5FF]/20 rounded-2xl p-4 bg-[#0A1128]/95 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="text-[#00E5FF]" size={18} />
              <div className="text-xs uppercase font-mono tracking-wider font-bold">CROSS-SECTION DEPLOYER</div>
            </div>
            <button
              onClick={onToggleStructure}
              className={`text-xs px-3 py-1.5 rounded-lg border font-mono transition-all duration-300 ${
                structureMode
                  ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                  : 'bg-[#00E5FF]/10 border-[#00E5FF]/40 text-[#00E5FF]'
              }`}
              id="hud-structure-toggle"
            >
              {structureMode ? 'COLLAPSE RETICLE' : 'EXPLODE LAYERS'}
            </button>
          </div>

          <p className="text-[11px] text-gray-400 leading-relaxed font-mono">
            {structureMode 
              ? 'Planetary outer mantle split and slid apart along orbital vectors. Inner magnetic core shells are highlighted.'
              : 'Interactive 3D structural analysis. Click Explode to segment coordinates and analyze metallic core boundaries.'
            }
          </p>

          {structureMode && (
            <div className="space-y-2 mt-4 pt-4 border-t border-white/10" id="hud-structure-details">
              <div className="text-[10px] text-[#00E5FF] font-mono tracking-wider uppercase mb-2">Concentric Geological Rings</div>
              <div className="grid grid-cols-2 gap-1.5">
                {planet.layers.map((layer, idx) => (
                  <button
                    key={layer.name}
                    onClick={() => onSelectLayer(idx)}
                    className={`text-left p-2 rounded border text-xs transition-all duration-150 ${
                      activeLayerIndex === idx
                        ? 'bg-white/15 border-white text-white font-bold font-mono'
                        : 'bg-white/5 border-transparent text-gray-400 hover:bg-white/10 hover:text-white font-mono'
                    }`}
                    id={`layer-selector-${idx}`}
                  >
                    <span 
                      className="inline-block w-2.5 h-2.5 rounded-full mr-2 align-middle" 
                      style={{ backgroundColor: layer.color }} 
                    />
                    {layer.name}
                  </button>
                ))}
              </div>

              {/* ACTIVE SELECTED LAYER SUMMARY */}
              {planet.layers[activeLayerIndex] && (
                <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 space-y-2.5 mt-2 animate-fade-in text-gray-200">
                  <div className="flex items-center justify-between border-b border-white/15 pb-1">
                    <span className="font-semibold text-sm tracking-wide text-[#00E5FF]">
                      {planet.layers[activeLayerIndex].name}
                    </span>
                    <span className="text-[10px] font-mono text-gray-400">
                      Thk: {planet.layers[activeLayerIndex].thickness}
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-300 leading-relaxed font-sans">
                    {planet.layers[activeLayerIndex].description}
                  </p>
                  <div className="grid grid-cols-2 gap-2 text-[10px] font-mono pt-1">
                    <div>
                      <span className="text-gray-400 block">Temperature</span>
                      <span className="text-amber-400 font-bold">{planet.layers[activeLayerIndex].temperature}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Composition</span>
                      <span className="text-gray-200 truncate" title={planet.layers[activeLayerIndex].composition}>
                        {planet.layers[activeLayerIndex].composition}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* SATELLITES & MOONS LIST */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Moon className="text-[#00E5FF]" size={16} />
            <span className="text-xs uppercase font-mono tracking-wider font-bold">Natural Satellites ({planet.moons.count})</span>
          </div>
          {planet.moons.count === 0 ? (
            <p className="text-xs text-gray-400 italic">This coordinate holds no orbits of natural moons.</p>
          ) : (
            <div className="flex flex-wrap gap-1.5">
              {planet.moons.notable.map((moon) => (
                <span 
                  key={moon} 
                  className="bg-indigo-950/40 text-indigo-200 border border-indigo-400/20 text-[11px] px-2.5 py-1 rounded-md font-mono"
                  id={`moon-badge-${moon}`}
                >
                  {moon}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* CURATED TIDBITS CARD */}
        <div className="bg-[#00E5FF]/5 border border-[#00E5FF]/10 rounded-2xl p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="text-yellow-400 animate-pulse" size={16} />
            <span className="text-xs uppercase font-mono tracking-wider font-bold text-gray-200">COSMIC TIDBITS</span>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed italic pr-2 font-mono">
            "{planet.funFacts[0]}"
          </p>
        </div>
      </div>
    </div>
  );
};
