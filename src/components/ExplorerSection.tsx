/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { PlanetData } from '../types';
import { PLANETS_DATA } from '../data';
import * as THREE from 'three';
import {
  createCraterTexture,
  createVenusTexture,
  createEarthTexture,
  createCloudsTexture,
  createMarsTexture,
  createJupiterTexture,
  createSaturnTexture,
  createSaturnRingsTexture,
  createIceBlueTexture,
  createDeepBlueTexture
} from './textureGenerator';
import { Search, Compass, ShieldAlert, Star, RotateCw, ZoomIn, Info } from 'lucide-react';

export const ExplorerSection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'terrestrial' | 'giant'>('all');
  const [activePlanetId, setActivePlanetId] = useState('earth');

  const container3dRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const activeMeshRef = useRef<THREE.Group | null>(null);

  // Filter list
  const filteredPlanets = PLANETS_DATA.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const isGiant = p.id === 'jupiter' || p.id === 'saturn' || p.id === 'uranus' || p.id === 'neptune';
    
    if (filterType === 'terrestrial') return matchesSearch && !isGiant;
    if (filterType === 'giant') return matchesSearch && isGiant;
    return matchesSearch;
  });

  const activePlanet = PLANETS_DATA.find((p) => p.id === activePlanetId) || PLANETS_DATA[0];

  // Initialize and spin standard mini WebGL preview box
  useEffect(() => {
    if (!container3dRef.current) return;

    const width = container3dRef.current.clientWidth;
    const height = container3dRef.current.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 50);
    camera.position.z = 6;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    rendererRef.current = renderer;

    container3dRef.current.innerHTML = '';
    container3dRef.current.appendChild(renderer.domElement);

    // Dynamic light bounds
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.8);
    mainLight.position.set(5, 3, 5);
    scene.add(mainLight);

    // Planet core group
    const planetGroup = new THREE.Group();
    scene.add(planetGroup);
    activeMeshRef.current = planetGroup;

    // Build the sphere
    const sphereGeom = new THREE.SphereGeometry(1.5, 64, 64);
    
    let canvasEl: HTMLCanvasElement;
    switch (activePlanet.texturePattern) {
      case 'crater': canvasEl = createCraterTexture(); break;
      case 'glowing_atmosphere': canvasEl = createVenusTexture(); break;
      case 'clouds': canvasEl = createEarthTexture(); break;
      case 'dust_red': canvasEl = createMarsTexture(); break;
      case 'gas_bands_jupiter': canvasEl = createJupiterTexture(); break;
      case 'gas_bands_saturn': canvasEl = createSaturnTexture(); break;
      case 'ice_blue': canvasEl = createIceBlueTexture(); break;
      default: canvasEl = createDeepBlueTexture();
    }

    const tex = new THREE.CanvasTexture(canvasEl);
    const standardMat = new THREE.MeshStandardMaterial({
      map: tex,
      roughness: 0.65,
      metalness: 0.05
    });
    const planetMesh = new THREE.Mesh(sphereGeom, standardMat);
    planetGroup.add(planetMesh);

    // Optional Clouds layer
    if (activePlanet.hasClouds) {
      const cloudGeom = new THREE.SphereGeometry(1.53, 32, 32);
      const cloudTex = new THREE.CanvasTexture(createCloudsTexture());
      const cloudMat = new THREE.MeshStandardMaterial({
        map: cloudTex,
        transparent: true,
        opacity: 0.55
      });
      const cloudMesh = new THREE.Mesh(cloudGeom, cloudMat);
      planetGroup.add(cloudMesh);
    }

    // Optional Rings layer
    if (activePlanet.hasRings && activePlanet.ringRadiusInner && activePlanet.ringRadiusOuter) {
      const ringGeom = new THREE.RingGeometry(1.5 * activePlanet.ringRadiusInner, 1.5 * activePlanet.ringRadiusOuter, 64);
      const ringTex = new THREE.CanvasTexture(createSaturnRingsTexture());
      const pos = ringGeom.attributes.position;
      const uvs = ringGeom.attributes.uv;
      const v3 = new THREE.Vector3();
      for (let i = 0; i < pos.count; i++) {
        v3.fromBufferAttribute(pos, i);
        const dist = v3.length();
        const rNormalized = (dist - 1.5 * activePlanet.ringRadiusInner) / (1.5 * (activePlanet.ringRadiusOuter - activePlanet.ringRadiusInner));
        uvs.setXY(i, rNormalized, 0.5);
      }
      const ringMat = new THREE.MeshStandardMaterial({
        map: ringTex,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide
      });
      const ringsMesh = new THREE.Mesh(ringGeom, ringMat);
      ringsMesh.rotation.x = Math.PI / 2.3; // tilt rings
      planetGroup.add(ringsMesh);
    }

    // Set axis tilt
    planetGroup.rotation.z = THREE.MathUtils.degToRad(activePlanet.tilt);

    // Drag to spin mechanics
    let isDragging = false;
    let prevX = 0;
    let prevY = 0;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;
      planetGroup.rotation.y += dx * 0.01;
      planetGroup.rotation.x += dy * 0.01;
      prevX = e.clientX;
      prevY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const canvasDom = renderer.domElement;
    canvasDom.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Animate spin loop
    let animeId: number;
    const tick = () => {
      if (!isDragging) {
        planetGroup.rotation.y += 0.003;
      }
      renderer.render(scene, camera);
      animeId = requestAnimationFrame(tick);
    };
    tick();

    // Cleanups
    return () => {
      cancelAnimationFrame(animeId);
      canvasDom.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      renderer.dispose();
    };
  }, [activePlanetId]);

  // Handle sizes resize
  useEffect(() => {
    const handleResize = () => {
      if (!container3dRef.current || !rendererRef.current) return;
      const w = container3dRef.current.clientWidth;
      const h = container3dRef.current.clientHeight;
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div id="explorer-panel" className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-white select-none">
      
      {/* LEFT SIDEBAR: LIST & SEARCH */}
      <div className="lg:col-span-4 bg-[#0A1128]/85 border border-[#00E5FF]/10 rounded-2xl p-5 backdrop-blur-md flex flex-col space-y-4 max-h-[85vh] overflow-y-auto">
        <div className="space-y-1">
          <h3 className="text-xl font-semibold text-gray-100 flex items-center gap-2">
            <Compass className="text-[#00E5FF]" size={20} />
            Cosmic Archives
          </h3>
          <p className="text-xs text-gray-400 font-mono">Encyclopedia & scientific telemetry lookup</p>
        </div>

        {/* SEARCH BOX */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search celestial indices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm font-mono focus:outline-none focus:border-[#00E5FF]/50 transition-colors"
            id="explorer-search-input"
          />
        </div>

        {/* CLASSIFICATION FILTERS */}
        <div className="flex bg-white/5 p-1 rounded-lg border border-white/5">
          {(['all', 'terrestrial', 'giant'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`flex-1 text-xs py-1.5 rounded-md font-mono capitalize transition-all ${
                filterType === type 
                  ? 'bg-[#00E5FF]/20 text-[#00E5FF] font-bold border border-[#00E5FF]/30' 
                  : 'text-gray-400 hover:text-white'
              }`}
              id={`filter-btn-${type}`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* PLANET TILES LIST */}
        <div className="space-y-2 overflow-y-auto flex-1 pr-1">
          {filteredPlanets.map((planet) => {
            const isSelected = planet.id === activePlanetId;
            return (
              <button
                key={planet.id}
                onClick={() => setActivePlanetId(planet.id)}
                className={`w-full text-left p-3.5 rounded-xl border flex items-center justify-between transition-all duration-200 ${
                  isSelected 
                    ? 'bg-[#00E5FF]/10 border-[#00E5FF]/50 shadow-lg shadow-cyan-950/20' 
                    : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20'
                }`}
                id={`explorer-item-${planet.id}`}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-6 h-6 rounded-full border border-white/25 shadow-md flex items-center justify-center text-[10px] font-mono select-none"
                    style={{ background: planet.colorHex }}
                  />
                  <div>
                    <h4 className="text-sm font-semibold tracking-wide text-gray-200">{planet.name}</h4>
                    <span className="text-[10px] text-gray-400 font-mono">D: {planet.diameter}</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono bg-white/5 border border-white/10 px-2 py-0.5 rounded text-gray-300">
                  {planet.id === 'jupiter' || planet.id === 'saturn' || planet.id === 'uranus' || planet.id === 'neptune' ? 'Gas Giant' : 'Terrestrial'}
                </span>
              </button>
            );
          })}
          {filteredPlanets.length === 0 && (
            <div className="text-center py-6 text-xs text-gray-400 italic">No planetary records match your search query.</div>
          )}
        </div>
      </div>

      {/* RIGHT DISPLAY: DEEP INSIGHTS + 3D MODEL BOX */}
      <div className="lg:col-span-8 flex flex-col space-y-6">
        
        {/* INTERACTIVE 3D PREVIEW UNIT */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 bg-[#0A1128]/85 border border-[#00E5FF]/10 rounded-2xl p-5 backdrop-blur-md">
          {/* WebGL viewport on left */}
          <div className="md:col-span-5 relative bg-black/40 rounded-xl border border-white/5 h-[280px] overflow-hidden flex flex-col items-center justify-center">
            <div ref={container3dRef} className="w-full h-full" id="explorer-mini-3d-canvas" />
            
            {/* Interactive tag overlay */}
            <div className="absolute top-3 left-3 bg-[#0A1128]/80 border border-[#00E5FF]/30 rounded px-2.5 py-1 text-[10px] font-mono text-[#00E5FF] tracking-wider flex items-center gap-1.5">
              <RotateCw className="animate-spin text-cyan-400" size={10} />
              DRAG TO ROTATE WORLD
            </div>

            <div className="absolute bottom-3 right-3 text-[10px] font-mono text-gray-400">
              Axial Tilt: {activePlanet.tilt}°
            </div>
          </div>

          {/* Quick specs readouts on right */}
          <div className="md:col-span-7 flex flex-col justify-between space-y-4">
            <div>
              <span className="text-[10px] font-mono tracking-[0.25em] text-[#00E5FF]">SYSTEM INDEXED RECORD</span>
              <h2 className="text-4xl font-sans tracking-wide font-medium mt-1 text-white">{activePlanet.name}</h2>
              <p className="text-xs text-gray-300 mt-2.5 leading-relaxed font-sans">{activePlanet.overview}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10">
              <div>
                <span className="text-[10px] font-mono text-gray-400 block uppercase">Formation Profile</span>
                <span className="text-xs text-gray-200 mt-0.5 leading-relaxed font-mono block">Carbon/Ice accretion systems</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-gray-400 block uppercase">Atmospheric Envelope</span>
                <span className="text-xs text-[#00E5FF] font-mono block overflow-hidden text-ellipsis whitespace-nowrap" title={activePlanet.atmosphereComposition}>
                  {activePlanet.atmosphereComposition}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* DETAILED INFORMATION EXPANDED SHEETS */}
        <div className="bg-[#0A1128]/85 border border-[#00E5FF]/10 rounded-2xl p-6 backdrop-blur-md space-y-6">
          <div className="border-b border-white/10 pb-3 flex items-center justify-between">
            <h4 className="text-lg font-semibold text-gray-100 flex items-center gap-2">
              <Info size={18} className="text-[#00E5FF]" />
              Scientific Analysis dossiers
            </h4>
            <span className="text-xs text-gray-400 font-mono">Dossier ID: PX-{activePlanet.id.toUpperCase()}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              {/* FORMATION CARD */}
              <div className="bg-white/5 border border-white/5 rounded-xl p-4 space-y-1.5">
                <span className="text-[11px] font-mono text-[#00E5FF] font-bold tracking-wider uppercase">Planetary Formation</span>
                <p className="text-xs text-gray-300 leading-relaxed">{activePlanet.formation}</p>
              </div>

              {/* SURFACE CONDITIONS */}
              <div className="bg-white/5 border border-white/5 rounded-xl p-4 space-y-1.5">
                <span className="text-[11px] font-mono text-emerald-400 font-bold tracking-wider uppercase">Surface Conditions</span>
                <p className="text-xs text-gray-300 leading-relaxed">{activePlanet.surfaceConditions}</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* INTERNAL STRUCTURE SUMMARY */}
              <div className="bg-white/5 border border-white/5 rounded-xl p-4 space-y-2.5">
                <span className="text-[11px] font-mono text-amber-400 font-bold tracking-wider uppercase">Internal Structure Profile</span>
                <div className="space-y-2">
                  {activePlanet.layers.map((layer) => (
                    <div key={layer.name} className="flex justify-between items-center text-xs border-b border-white/5 pb-1 last:border-0 last:pb-0">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: layer.color }} />
                        <span className="font-semibold text-gray-200">{layer.name}</span>
                      </div>
                      <span className="text-gray-400 font-mono text-[11px]">{layer.thickness} | {layer.temperature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CURATED SCIENTIFIC FACTS */}
              <div className="bg-purple-950/15 border border-purple-500/10 rounded-xl p-4 space-y-2">
                <span className="text-[11px] font-mono text-purple-300 font-bold tracking-wider uppercase block">Planetary Anomalies</span>
                <ul className="text-xs text-gray-300 space-y-1.5 list-disc pl-4 font-mono leading-relaxed">
                  {activePlanet.scientificFacts.map((sci, idx) => (
                    <li key={idx}>{sci}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
