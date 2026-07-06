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
import { Scale, RefreshCw, Star, HelpCircle, Flame, Moon, ArrowLeftRight } from 'lucide-react';

export const ComparisonSection: React.FC = () => {
  const [planetAId, setPlanetAId] = useState('earth');
  const [planetBId, setPlanetBId] = useState('mars');

  const container3dARef = useRef<HTMLDivElement>(null);
  const container3dBRef = useRef<HTMLDivElement>(null);
  const rendererARef = useRef<THREE.WebGLRenderer | null>(null);
  const rendererBRef = useRef<THREE.WebGLRenderer | null>(null);

  const planetA = PLANETS_DATA.find((p) => p.id === planetAId) || PLANETS_DATA[0];
  const planetB = PLANETS_DATA.find((p) => p.id === planetBId) || PLANETS_DATA[1];

  // Independent 3D viewport setup for Planet A
  useEffect(() => {
    if (!container3dARef.current) return;
    const width = container3dARef.current.clientWidth;
    const height = container3dARef.current.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 10);
    camera.position.z = 4.5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    rendererARef.current = renderer;

    container3dARef.current.innerHTML = '';
    container3dARef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.6);
    mainLight.position.set(5, 3, 5);
    scene.add(mainLight);

    const planetGroup = new THREE.Group();
    scene.add(planetGroup);

    // Apply relative size scaling inside comparison frame
    // Size scales range from 0.38 to 2.2. Perfect rendering formula:
    const sizeRatioA = planetA.sizeScale / Math.max(planetA.sizeScale, planetB.sizeScale);
    const geometrySize = 1.35 * sizeRatioA;

    const sphereGeom = new THREE.SphereGeometry(geometrySize, 64, 64);
    let canvasEl: HTMLCanvasElement;
    switch (planetA.texturePattern) {
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
      roughness: 0.7,
    });
    const planetMesh = new THREE.Mesh(sphereGeom, standardMat);
    planetGroup.add(planetMesh);

    // Optional clouds
    if (planetA.hasClouds) {
      const cloudGeom = new THREE.SphereGeometry(geometrySize * 1.018, 32, 32);
      const cloudTex = new THREE.CanvasTexture(createCloudsTexture());
      const cloudMat = new THREE.MeshStandardMaterial({
        map: cloudTex,
        transparent: true,
        opacity: 0.5
      });
      const cloudMesh = new THREE.Mesh(cloudGeom, cloudMat);
      planetGroup.add(cloudMesh);
    }

    // Optional rings
    if (planetA.hasRings && planetA.ringRadiusInner && planetA.ringRadiusOuter) {
      const ringGeom = new THREE.RingGeometry(geometrySize * planetA.ringRadiusInner, geometrySize * planetA.ringRadiusOuter, 64);
      const ringTex = new THREE.CanvasTexture(createSaturnRingsTexture());
      const pos = ringGeom.attributes.position;
      const uvs = ringGeom.attributes.uv;
      const v3 = new THREE.Vector3();
      for (let i = 0; i < pos.count; i++) {
        v3.fromBufferAttribute(pos, i);
        const dist = v3.length();
        const rNormalized = (dist - geometrySize * planetA.ringRadiusInner) / (geometrySize * (planetA.ringRadiusOuter - planetA.ringRadiusInner));
        uvs.setXY(i, rNormalized, 0.5);
      }
      const ringMat = new THREE.MeshStandardMaterial({
        map: ringTex,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide
      });
      const ringsMesh = new THREE.Mesh(ringGeom, ringMat);
      ringsMesh.rotation.x = Math.PI / 2.3;
      planetGroup.add(ringsMesh);
    }

    planetGroup.rotation.z = THREE.MathUtils.degToRad(planetA.tilt);

    let animeId: number;
    const tick = () => {
      planetGroup.rotation.y += 0.005;
      renderer.render(scene, camera);
      animeId = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(animeId);
      renderer.dispose();
    };
  }, [planetAId, planetBId]); // Recreate if scales relative to B changes

  // Independent 3D viewport setup for Planet B
  useEffect(() => {
    if (!container3dBRef.current) return;
    const width = container3dBRef.current.clientWidth;
    const height = container3dBRef.current.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 10);
    camera.position.z = 4.5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    rendererBRef.current = renderer;

    container3dBRef.current.innerHTML = '';
    container3dBRef.current.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.6);
    mainLight.position.set(5, 3, 5);
    scene.add(mainLight);

    const planetGroup = new THREE.Group();
    scene.add(planetGroup);

    // Apply relative size scaling inside comparison frame
    const sizeRatioB = planetB.sizeScale / Math.max(planetA.sizeScale, planetB.sizeScale);
    const geometrySize = 1.35 * sizeRatioB;

    const sphereGeom = new THREE.SphereGeometry(geometrySize, 64, 64);
    let canvasEl: HTMLCanvasElement;
    switch (planetB.texturePattern) {
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
      roughness: 0.7,
    });
    const planetMesh = new THREE.Mesh(sphereGeom, standardMat);
    planetGroup.add(planetMesh);

    // Optional clouds
    if (planetB.hasClouds) {
      const cloudGeom = new THREE.SphereGeometry(geometrySize * 1.018, 32, 32);
      const cloudTex = new THREE.CanvasTexture(createCloudsTexture());
      const cloudMat = new THREE.MeshStandardMaterial({
        map: cloudTex,
        transparent: true,
        opacity: 0.5
      });
      const cloudMesh = new THREE.Mesh(cloudGeom, cloudMat);
      planetGroup.add(cloudMesh);
    }

    // Optional rings
    if (planetB.hasRings && planetB.ringRadiusInner && planetB.ringRadiusOuter) {
      const ringGeom = new THREE.RingGeometry(geometrySize * planetB.ringRadiusInner, geometrySize * planetB.ringRadiusOuter, 64);
      const ringTex = new THREE.CanvasTexture(createSaturnRingsTexture());
      const pos = ringGeom.attributes.position;
      const uvs = ringGeom.attributes.uv;
      const v3 = new THREE.Vector3();
      for (let i = 0; i < pos.count; i++) {
        v3.fromBufferAttribute(pos, i);
        const dist = v3.length();
        const rNormalized = (dist - geometrySize * planetB.ringRadiusInner) / (geometrySize * (planetB.ringRadiusOuter - planetB.ringRadiusInner));
        uvs.setXY(i, rNormalized, 0.5);
      }
      const ringMat = new THREE.MeshStandardMaterial({
        map: ringTex,
        transparent: true,
        opacity: 0.9,
        side: THREE.DoubleSide
      });
      const ringsMesh = new THREE.Mesh(ringGeom, ringMat);
      ringsMesh.rotation.x = Math.PI / 2.3;
      planetGroup.add(ringsMesh);
    }

    planetGroup.rotation.z = THREE.MathUtils.degToRad(planetB.tilt);

    let animeId: number;
    const tick = () => {
      planetGroup.rotation.y += 0.005;
      renderer.render(scene, camera);
      animeId = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(animeId);
      renderer.dispose();
    };
  }, [planetAId, planetBId]); // Recreate if scales relative to A changes

  // Swap dropdown selections instantly
  const handleSwap = () => {
    const temp = planetAId;
    setPlanetAId(planetBId);
    setPlanetBId(temp);
  };

  return (
    <div id="comparison-panel" className="space-y-6 text-white select-none">
      
      {/* HEADER CONTROLS */}
      <div className="bg-[#0A1128]/85 border border-[#00E5FF]/10 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 backdrop-blur-md">
        <div className="space-y-1">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Scale className="text-[#00E5FF]" size={20} />
            Comparative Flight Deck
          </h3>
          <p className="text-xs text-gray-400 font-mono">Cross-analyzing multi-axis orbital metrics & relative bulk profiles</p>
        </div>

        {/* SELECT DROP DOWNS */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Planet A selector */}
          <select
            value={planetAId}
            onChange={(e) => setPlanetAId(e.target.value)}
            className="bg-zinc-900 border border-white/20 rounded-lg text-sm px-3.5 py-2 text-white font-mono focus:outline-none focus:border-[#00E5FF]/50"
            id="comp-select-a"
          >
            {PLANETS_DATA.map((p) => (
              <option key={p.id} value={p.id} disabled={p.id === planetBId}>
                {p.name}
              </option>
            ))}
          </select>

          {/* Swap icon */}
          <button
            onClick={handleSwap}
            className="p-2 border border-white/10 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all flex items-center justify-center cursor-pointer"
            title="Swap Planets"
            id="comp-swap-btn"
          >
            <ArrowLeftRight size={16} />
          </button>

          {/* Planet B selector */}
          <select
            value={planetBId}
            onChange={(e) => setPlanetBId(e.target.value)}
            className="bg-zinc-900 border border-white/20 rounded-lg text-sm px-3.5 py-2 text-white font-mono focus:outline-none focus:border-[#00E5FF]/50"
            id="comp-select-b"
          >
            {PLANETS_DATA.map((p) => (
              <option key={p.id} value={p.id} disabled={p.id === planetAId}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* SIDE-BY-SIDE 3D VIEWPORTS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Planet A Block */}
        <div className="bg-[#0A1128]/85 border border-[#00E5FF]/10 rounded-2xl p-5 backdrop-blur-md flex flex-col items-center relative overflow-hidden">
          <div className="absolute top-4 left-4 bg-white/5 border border-white/10 px-2.5 py-1 rounded text-[10px] font-mono tracking-widest uppercase">
            VECTOR COORD Alpha
          </div>
          <h4 className="text-2xl font-bold font-sans tracking-wide mt-6">{planetA.name}</h4>
          
          {/* Canvas Box */}
          <div ref={container3dARef} className="w-full h-[250px] mt-2 cursor-grab active:cursor-grabbing" id="comp-mini-3d-canvas-a" />
          
          <div className="text-[11px] font-mono text-gray-400 mt-2 border-t border-white/10 pt-2 w-full text-center">
            Relative Volume: {(planetA.sizeScale**3).toFixed(2)} Vol-Units
          </div>
        </div>

        {/* Planet B Block */}
        <div className="bg-[#0A1128]/85 border border-[#00E5FF]/10 rounded-2xl p-5 backdrop-blur-md flex flex-col items-center relative overflow-hidden">
          <div className="absolute top-4 left-4 bg-white/5 border border-white/10 px-2.5 py-1 rounded text-[10px] font-mono tracking-widest uppercase text-[#00E5FF]">
            VECTOR COORD Beta
          </div>
          <h4 className="text-2xl font-bold font-sans tracking-wide mt-6 text-white">{planetB.name}</h4>
          
          {/* Canvas Box */}
          <div ref={container3dBRef} className="w-full h-[250px] mt-2 cursor-grab active:cursor-grabbing" id="comp-mini-3d-canvas-b" />
          
          <div className="text-[11px] font-mono text-gray-400 mt-2 border-t border-white/10 pt-2 w-full text-center">
            Relative Volume: {(planetB.sizeScale**3).toFixed(2)} Vol-Units
          </div>
        </div>

      </div>

      {/* DETAILED SIDE-BY-SIDE METADATA COMPARISON TABLES */}
      <div className="bg-[#0A1128]/85 border border-[#00E5FF]/10 rounded-2xl p-6 backdrop-blur-md">
        <h4 className="text-lg font-semibold border-b border-white/10 pb-3 flex items-center gap-2">
          <Scale size={18} className="text-[#00E5FF]" /> Telemetry Parameter Contrast
        </h4>

        <div className="space-y-4 mt-5">
          {/* Comparison Row Builder */}
          {[
            { label: 'Calculated Diameter', valA: planetA.diameter, valB: planetB.diameter, scaleIcon: <Scale size={12} className="text-[#00E5FF]" /> },
            { label: 'Planetary Mass Metric', valA: planetA.mass, valB: planetB.mass, scaleIcon: <Star size={12} className="text-amber-400" /> },
            { label: 'Surface Gravity Constant', valA: planetA.gravity, valB: planetB.gravity, scaleIcon: <RefreshCw size={12} className="text-emerald-400" /> },
            { label: 'Operational Ambient Temp', valA: planetA.temperature, valB: planetB.temperature, scaleIcon: <Flame size={12} className="text-rose-400" /> },
            { label: 'Orbital Period Duration', valA: planetA.orbitalPeriod, valB: planetB.orbitalPeriod, scaleIcon: <Star size={12} className="text-yellow-400" /> },
            { label: 'Satelittes Moon Count', valA: `${planetA.moons.count} Moons`, valB: `${planetB.moons.count} Moons`, scaleIcon: <Moon size={12} className="text-indigo-400" /> },
          ].map((row, idx) => {
            return (
              <div 
                key={idx} 
                className="grid grid-cols-3 items-center py-3.5 px-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors"
                id={`comp-row-${idx}`}
              >
                {/* Planet A value */}
                <div className="text-sm font-semibold tracking-wide text-gray-200 truncate pr-2">{row.valA}</div>

                {/* Center metric name */}
                <div className="text-center font-mono text-[10px] tracking-wider uppercase text-[#00E5FF]">
                  {row.label}
                </div>

                {/* Planet B value */}
                <div className="text-sm font-semibold tracking-wide text-gray-200 text-right truncate pl-2">{row.valB}</div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
