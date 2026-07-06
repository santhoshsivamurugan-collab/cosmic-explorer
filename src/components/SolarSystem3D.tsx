/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { PlanetData } from '../types';
import { PLANETS_DATA } from '../data';
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
import { Play, Pause, RotateCcw, Video, Compass, ZoomIn, ZoomOut, Eye, Layers } from 'lucide-react';

interface SolarSystem3DProps {
  selectedPlanet: PlanetData | null;
  onSelectPlanet: (planet: PlanetData | null) => void;
  structureMode: boolean;
  activeLayerIndex: number;
  onSelectLayer: (index: number) => void;
}

export const SolarSystem3D: React.FC<SolarSystem3DProps> = ({
  selectedPlanet,
  onSelectPlanet,
  structureMode,
  activeLayerIndex,
  onSelectLayer,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  // Simulation states
  const [isPlaying, setIsPlaying] = useState(true);
  const [simSpeed, setSimSpeed] = useState(1.0);
  const [showOrbits, setShowOrbits] = useState(true);
  const [activeTracking, setActiveTracking] = useState(true);
  const [travelState, setTravelState] = useState<'idle' | 'warping' | 'decelerating'>('idle');

  // Animation refs to mutate directly in Three.js render loop
  const sunMeshRef = useRef<THREE.Mesh | null>(null);
  const sunGlowMeshRef = useRef<THREE.Mesh | null>(null);
  const planetMeshesRef = useRef<{ [key: string]: THREE.Group }>({});
  const planetAtmospheresRef = useRef<{ [key: string]: THREE.Mesh }>({});
  const cloudsMeshesRef = useRef<{ [key: string]: THREE.Mesh }>({});
  const planetAnglesRef = useRef<{ [key: string]: number }>({});
  const starFieldRef = useRef<THREE.Points | null>(null);
  const nebulaParticlesRef = useRef<THREE.Group | null>(null);

  // Hyper-drive warp lines
  const warpLinesRef = useRef<THREE.LineSegments | null>(null);

  // Exploded structure meshes container
  const explodedGroupRef = useRef<THREE.Group | null>(null);

  // Interactive controls state
  const isDragging = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });
  const cameraRotation = useRef({ phi: Math.PI / 3, theta: Math.PI / 4, radius: 45 });

  // Initialize Scene, Camera, Renderer
  useEffect(() => {
    if (!containerRef.current) return;

    // SCENE
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.fog = new THREE.FogExp2(0x050816, 0.0015);

    // CAMERA
    const camera = new THREE.PerspectiveCamera(
      60,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    cameraRef.current = camera;

    // RENDERER
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    rendererRef.current = renderer;
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;

    // Wipe any old canvas
    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(renderer.domElement);

    // ATMOSPHERIC NEBULA GLOW
    const nebulaGroup = new THREE.Group();
    nebulaParticlesRef.current = nebulaGroup;
    scene.add(nebulaGroup);

    // Procedurally create some space dust/nebula clouds
    const nebulaColors = [0x00E5FF, 0x5e17eb, 0x274EAB];
    nebulaColors.forEach((color, idx) => {
      const size = 150 + idx * 50;
      const geom = new THREE.PlaneGeometry(size, size);
      
      // Draw smooth radial gradient clouds on canvas
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext('2d')!;
      const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      const hexColor = '#' + color.toString(16).padStart(6, '0');
      grad.addColorStop(0, hexColor + '1E'); // very faint
      grad.addColorStop(0.5, hexColor + '08'); 
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 128, 128);

      const tex = new THREE.CanvasTexture(canvas);
      const mat = new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide
      });

      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.set(
        (Math.random() - 0.5) * 80,
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 120 - 50
      );
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      nebulaGroup.add(mesh);
    });

    // STARS BACKGROUND (DENSE STARFIELD)
    const starCount = 3500;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);
    const starAlpha = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
      // Scatter in a shell far away
      const r = 250 + Math.random() * 150;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);

      starPositions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      starPositions[i * 3 + 2] = r * Math.cos(phi);

      // Star hues: bluish, white, slightly warm yellow
      const rand = Math.random();
      if (rand < 0.25) {
        starColors[i * 3] = 0.8; starColors[i * 3 + 1] = 0.9; starColors[i * 3 + 2] = 1.0; // blue-white
      } else if (rand < 0.4) {
        starColors[i * 3] = 1.0; starColors[i * 3 + 1] = 0.95; starColors[i * 3 + 2] = 0.8; // amber-white
      } else {
        starColors[i * 3] = 1.0; starColors[i * 3 + 1] = 1.0; starColors[i * 3 + 2] = 1.0; // crisp white
      }
      starAlpha[i] = 0.5 + Math.random() * 0.5;
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    // Dynamic scale star texture helper
    const starCanvas = document.createElement('canvas');
    starCanvas.width = 16;
    starCanvas.height = 16;
    const sCtx = starCanvas.getContext('2d')!;
    const sGrad = sCtx.createRadialGradient(8, 8, 0, 8, 8, 8);
    sGrad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    sGrad.addColorStop(0.3, 'rgba(255, 255, 255, 0.8)');
    sGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    sCtx.fillStyle = sGrad;
    sCtx.fillRect(0, 0, 16, 16);
    const starTexture = new THREE.CanvasTexture(starCanvas);

    const starMaterial = new THREE.PointsMaterial({
      size: 1.2,
      map: starTexture,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      sizeAttenuation: true,
      depthWrite: false,
    });

    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);
    starFieldRef.current = starField;

    // WARP SPEED LIGHT TRAILS
    const warpCount = 600;
    const warpGeometry = new THREE.BufferGeometry();
    const warpPositions = new Float32Array(warpCount * 6); // starts & ends (lines segments)
    const warpPosList: THREE.Vector3[] = [];

    for (let i = 0; i < warpCount; i++) {
      const dir = new THREE.Vector3(
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2,
        (Math.random() - 0.5) * 2
      ).normalize();
      
      const r = 20 + Math.random() * 200;
      const start = dir.clone().multiplyScalar(r);
      const end = dir.clone().multiplyScalar(r + 5); // tiny length in idle
      warpPosList.push(start, end);
    }

    const flatWarpPos = new Float32Array(warpCount * 6);
    for (let i = 0; i < warpCount * 2; i++) {
      flatWarpPos[i * 3] = warpPosList[i].x;
      flatWarpPos[i * 3 + 1] = warpPosList[i].y;
      flatWarpPos[i * 3 + 2] = warpPosList[i].z;
    }
    warpGeometry.setAttribute('position', new THREE.BufferAttribute(flatWarpPos, 3));
    const warpMaterial = new THREE.LineBasicMaterial({
      color: 0x00E5FF,
      transparent: true,
      opacity: 0.0, // hidden by default!
      blending: THREE.AdditiveBlending,
      linewidth: 2,
    });
    const warpLines = new THREE.LineSegments(warpGeometry, warpMaterial);
    scene.add(warpLines);
    warpLinesRef.current = warpLines;

    // LIGHTS
    const ambientLight = new THREE.AmbientLight(0x15203A, 0.4);
    scene.add(ambientLight);

    // Planetary core light source representing the Sun
    const sunLight = new THREE.PointLight(0xFFFFFF, 3.0, 1500, 0.5);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    // THE SUN
    const sunGeometry = new THREE.SphereGeometry(6, 64, 64);
    
    // Sun Procedural corona base
    const sunCanvas = document.createElement('canvas');
    sunCanvas.width = 512;
    sunCanvas.height = 256;
    const sunCtx = sunCanvas.getContext('2d')!;
    const sunGrd = sunCtx.createRadialGradient(256, 128, 0, 256, 128, 256);
    sunGrd.addColorStop(0, '#FFE875');
    sunGrd.addColorStop(0.5, '#F97316');
    sunGrd.addColorStop(1, '#DC2626');
    sunCtx.fillStyle = sunGrd;
    sunCtx.fillRect(0, 0, 512, 256);

    const sunTexture = new THREE.CanvasTexture(sunCanvas);
    const sunMaterial = new THREE.MeshBasicMaterial({
      map: sunTexture,
    });

    const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sunMesh);
    sunMeshRef.current = sunMesh;

    // SUN GLOW CORE
    const coronaGeom = new THREE.SphereGeometry(6.6, 32, 32);
    const coronaMat = new THREE.MeshBasicMaterial({
      color: 0xFACC15,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide
    });
    const sunGlowMesh = new THREE.Mesh(coronaGeom, coronaMat);
    scene.add(sunGlowMesh);
    sunGlowMeshRef.current = sunGlowMesh;

    // PLANETS & STRUCTURE BUILDERS
    const planetGroupMap: { [key: string]: THREE.Group } = {};

    PLANETS_DATA.forEach((data) => {
      const pGroup = new THREE.Group();
      planetGroupMap[data.id] = pGroup;
      scene.add(pGroup);

      // Orbit Position Initialization values (randomize slightly so they don't block each other initially)
      const cachedAngle = Math.random() * Math.PI * 2;
      planetAnglesRef.current[data.id] = cachedAngle;

      const pX = data.orbitRadius * Math.cos(cachedAngle);
      const pZ = data.orbitRadius * Math.sin(cachedAngle);
      pGroup.position.set(pX, 0, pZ);

      // Planet tilting container
      const pRotationContainer = new THREE.Group();
      pRotationContainer.rotation.z = THREE.MathUtils.degToRad(data.tilt);
      pGroup.add(pRotationContainer);

      // High-Fidelity Planet sphere
      const sizeScaleAdjust = data.sizeScale * 0.9;
      const sphereGeom = new THREE.SphereGeometry(sizeScaleAdjust, 64, 64);

      // Generate corresponding procedural textures
      let canvasTextureEl: HTMLCanvasElement;
      switch (data.texturePattern) {
        case 'crater': canvasTextureEl = createCraterTexture(); break;
        case 'glowing_atmosphere': canvasTextureEl = createVenusTexture(); break;
        case 'clouds': canvasTextureEl = createEarthTexture(); break;
        case 'dust_red': canvasTextureEl = createMarsTexture(); break;
        case 'gas_bands_jupiter': canvasTextureEl = createJupiterTexture(); break;
        case 'gas_bands_saturn': canvasTextureEl = createSaturnTexture(); break;
        case 'ice_blue': canvasTextureEl = createIceBlueTexture(); break;
        default: canvasTextureEl = createDeepBlueTexture();
      }

      const pTexture = new THREE.CanvasTexture(canvasTextureEl);
      const pMaterial = new THREE.MeshStandardMaterial({
        map: pTexture,
        roughness: data.id === 'earth' ? 0.4 : 0.85,
        metalness: data.id === 'mercury' ? 0.2 : 0.05,
      });

      const pMesh = new THREE.Mesh(sphereGeom, pMaterial);
      pMesh.castShadow = true;
      pMesh.receiveShadow = true;
      pMesh.name = 'planet_sphere';
      pRotationContainer.add(pMesh);

      // EARTH SPECIFIC moving clouds
      if (data.hasClouds) {
        const cloudGeom = new THREE.SphereGeometry(sizeScaleAdjust * 1.018, 32, 32);
        const cloudTex = new THREE.CanvasTexture(createCloudsTexture());
        const cloudMat = new THREE.MeshStandardMaterial({
          map: cloudTex,
          transparent: true,
          opacity: 0.65,
          blending: THREE.NormalBlending,
          depthWrite: false,
        });
        const cloudMesh = new THREE.Mesh(cloudGeom, cloudMat);
        pRotationContainer.add(cloudMesh);
        cloudsMeshesRef.current[data.id] = cloudMesh;
      }

      // SPACE ATMOSPHERE OUTER GLOW
      if (data.hasAtmosphereGlow) {
        const glowGeom = new THREE.SphereGeometry(sizeScaleAdjust * 1.15, 32, 32);
        const glowMat = new THREE.MeshBasicMaterial({
          color: data.atmosphereColor ? new THREE.Color(data.atmosphereColor) : new THREE.Color(0x00E5FF),
          transparent: true,
          opacity: 0.08,
          blending: THREE.AdditiveBlending,
          side: THREE.BackSide
        });
        const glowMesh = new THREE.Mesh(glowGeom, glowMat);
        pRotationContainer.add(glowMesh);
        planetAtmospheresRef.current[data.id] = glowMesh;
      }

      // SATURN SATURN SPECIALLY DETAILED RINGS
      if (data.hasRings && data.ringRadiusInner && data.ringRadiusOuter) {
        const rInner = sizeScaleAdjust * data.ringRadiusInner;
        const rOuter = sizeScaleAdjust * data.ringRadiusOuter;
        const ringGeom = new THREE.RingGeometry(rInner, rOuter, 128);

        // Map correct rings transparency procedural texture
        const ringTex = new THREE.CanvasTexture(createSaturnRingsTexture());
        // In order to map a 1D strip circumferentially in RingGeometry, map top uv coordinate
        // Rotate UVs mapping
        const pos = ringGeom.attributes.position;
        const uvs = ringGeom.attributes.uv;
        const v3 = new THREE.Vector3();
        for (let i = 0; i < pos.count; i++) {
          v3.fromBufferAttribute(pos, i);
          const dist = v3.length();
          const rNormalized = (dist - rInner) / (rOuter - rInner);
          uvs.setXY(i, rNormalized, 0.5);
        }

        const ringMat = new THREE.MeshStandardMaterial({
          map: ringTex,
          transparent: true,
          opacity: 0.9,
          side: THREE.DoubleSide,
          depthWrite: true,
          roughness: 0.6,
        });

        const ringMesh = new THREE.Mesh(ringGeom, ringMat);
        ringMesh.rotation.x = Math.PI / 2; // Flat ring horizontal
        ringMesh.castShadow = true;
        ringMesh.receiveShadow = true;
        pRotationContainer.add(ringMesh);
      }

      // ORBIT GLOW TRAILS
      const orbitGeometry = new THREE.BufferGeometry();
      const pointsCount = 180;
      const oPositions = new Float32Array((pointsCount + 1) * 3);

      for (let j = 0; j <= pointsCount; j++) {
        const angle = (j / pointsCount) * Math.PI * 2;
        oPositions[j * 3] = data.orbitRadius * Math.cos(angle);
        oPositions[j * 3 + 1] = 0;
        oPositions[j * 3 + 2] = data.orbitRadius * Math.sin(angle);
      }

      orbitGeometry.setAttribute('position', new THREE.BufferAttribute(oPositions, 3));
      const rColor = new THREE.Color(data.colorHex);
      const orbitMaterial = new THREE.LineBasicMaterial({
        color: rColor,
        transparent: true,
        opacity: 0.15,
        linewidth: 1,
      });

      const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
      scene.add(orbitLine);
    });

    planetMeshesRef.current = planetGroupMap;

    // Cleanups on destroy
    return () => {
      renderer.dispose();
    };
  }, []);

  // Sync orbit viewing styles
  useEffect(() => {
    if (!sceneRef.current) return;
    sceneRef.current.traverse((node) => {
      if (node instanceof THREE.Line && node.geometry && !node.name.includes('warp')) {
        node.visible = showOrbits;
      }
    });
  }, [showOrbits]);

  // Handle active travel actions when planet changes
  useEffect(() => {
    if (!sceneRef.current || !cameraRef.current) return;

    if (selectedPlanet) {
      // Warp sequence triggered!
      setTravelState('warping');

      let val = 0;
      const interval = setInterval(() => {
        val += 0.05;
        if (val >= 1.0) {
          clearInterval(interval);
          setTravelState('decelerating');
          setTimeout(() => {
            setTravelState('idle');
          }, 300);
        }
      }, 15);
    } else {
      setTravelState('idle');
    }
  }, [selectedPlanet]);

  // Sync internal structure mesh generation
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    // Clean previous exploded details
    if (explodedGroupRef.current) {
      scene.remove(explodedGroupRef.current);
      explodedGroupRef.current = null;
    }

    // Toggle planet visibility based on structure mode
    Object.keys(planetMeshesRef.current).forEach((key) => {
      const grp = planetMeshesRef.current[key];
      const selectedId = selectedPlanet?.id;
      
      // If we are currently inspecting this planet & structure mode is active
      if (key === selectedId && structureMode) {
        grp.visible = false; // Hide classical rotating planet
      } else {
        grp.visible = true;  // Otherwise show standard
      }
    });

    if (structureMode && selectedPlanet) {
      // Build Exploded Sci-Fi structure!
      const explodedGroup = new THREE.Group();
      explodedGroupRef.current = explodedGroup;
      scene.add(explodedGroup);

      // Locate where the planet group lies to position exploded group
      const baseGroup = planetMeshesRef.current[selectedPlanet.id];
      if (baseGroup) {
        explodedGroup.position.copy(baseGroup.position);
      }

      // We will slice the planet shells!
      // To mimic a perfect exploded technical CAD widget, we will draw:
      // 1. A sliding hemisphere on the left (sliced shell)
      // 2. Beautiful nested solid color shells in the center representing layers!
      
      const sizeScaleAdjust = selectedPlanet.sizeScale * 0.9;

      // Sliding visual hemisphere helper
      let leftTexCanvas: HTMLCanvasElement;
      switch (selectedPlanet.texturePattern) {
        case 'crater': leftTexCanvas = createCraterTexture(); break;
        case 'glowing_atmosphere': leftTexCanvas = createVenusTexture(); break;
        case 'clouds': leftTexCanvas = createEarthTexture(); break;
        case 'dust_red': leftTexCanvas = createMarsTexture(); break;
        case 'gas_bands_jupiter': leftTexCanvas = createJupiterTexture(); break;
        case 'gas_bands_saturn': leftTexCanvas = createSaturnTexture(); break;
        case 'ice_blue': leftTexCanvas = createIceBlueTexture(); break;
        default: leftTexCanvas = createDeepBlueTexture();
      }

      const outerMat = new THREE.MeshStandardMaterial({
        map: new THREE.CanvasTexture(leftTexCanvas),
        roughness: 0.6,
        side: THREE.DoubleSide
      });

      // Left Hemispherical outer shell sliding left
      const shellGeom = new THREE.SphereGeometry(sizeScaleAdjust, 32, 32, 0, Math.PI); // Half-sphere
      const leftShell = new THREE.Mesh(shellGeom, outerMat);
      leftShell.rotation.y = -Math.PI / 2;
      leftShell.position.x = -1.6; // slide left
      leftShell.castShadow = true;
      leftShell.receiveShadow = true;
      explodedGroup.add(leftShell);

      // Right Hemispherical outer shell sliding right
      const rightShell = leftShell.clone();
      rightShell.rotation.y = Math.PI / 2;
      rightShell.position.x = 1.6; // slide right
      explodedGroup.add(rightShell);

      // In the middle, overlay concentric neon layers
      // Sort reverse to place inner layer at center
      const sortedLayers = [...selectedPlanet.layers].sort((a,b) => b.radiusRatio - a.radiusRatio);

      sortedLayers.forEach((layer, index) => {
        const layerRadius = sizeScaleAdjust * layer.radiusRatio;
        
        let layerGeom: THREE.SphereGeometry;
        // Slice the layer in half slightly so we can see inside of inside!
        // We will clip a 3D hemisphere for structure layers so the innermost is a nest of nested caps!
        layerGeom = new THREE.SphereGeometry(layerRadius, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2); // North cap dome

        // Accentuate with glowing sci-fi edge tracing
        const wireColor = layer.color;
        const layerMat = new THREE.MeshStandardMaterial({
          color: new THREE.Color(wireColor),
          transparent: true,
          opacity: activeLayerIndex === index ? 0.95 : 0.65,
          roughness: 0.2,
          metalness: 0.1,
          side: THREE.DoubleSide,
          emissive: new THREE.Color(wireColor).multiplyScalar(activeLayerIndex === index ? 0.4 : 0.1)
        });

        const layerMesh = new THREE.Mesh(layerGeom, layerMat);
        layerMesh.rotation.x = Math.PI / 2; // Flat boundary
        layerMesh.position.x = 0; // centered in the middle of split hemispheres!
        explodedGroup.add(layerMesh);

        // Add layer ring boundary glowing outline
        const torusGeom = new THREE.TorusGeometry(layerRadius, 0.02, 8, 48);
        const torusMat = new THREE.MeshBasicMaterial({
          color: activeLayerIndex === index ? 0xFFFFFF : new THREE.Color(wireColor),
          transparent: true,
          opacity: 0.8
        });
        const boundaryTorus = new THREE.Mesh(torusGeom, torusMat);
        boundaryTorus.rotation.x = Math.PI / 2;
        explodedGroup.add(boundaryTorus);
      });
    }
  }, [structureMode, selectedPlanet, activeLayerIndex]);

  // MAIN ANIMATION RENDER LOOP
  useEffect(() => {
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const scene = sceneRef.current;
      const renderer = rendererRef.current;
      const camera = cameraRef.current;

      if (!scene || !renderer || !camera) return;

      const delta = clock.getDelta();
      const runSpeedMultiplier = isPlaying ? simSpeed : 0;

      // SUN self rotation
      if (sunMeshRef.current) {
        sunMeshRef.current.rotation.y += 0.002;
      }
      if (sunGlowMeshRef.current) {
        sunGlowMeshRef.current.rotation.y -= 0.001;
      }

      // Nebulae slow cosmic twist
      if (nebulaParticlesRef.current) {
        nebulaParticlesRef.current.rotation.y += 0.0003;
      }

      // Pulsate / Twinkle stars gently
      if (starFieldRef.current) {
        const mat = starFieldRef.current.material as THREE.PointsMaterial;
        mat.size = 1.0 + Math.sin(clock.getElapsedTime() * 1.5) * 0.2;
      }

      // WARPING SCREEN LINES - HYPERDRIVE TRAILS
      if (warpLinesRef.current) {
        const warpMat = warpLinesRef.current.material as THREE.LineBasicMaterial;
        
        if (travelState === 'warping') {
          // Stretch and show!
          warpMat.opacity = THREE.MathUtils.lerp(warpMat.opacity, 0.85, 0.1);
          
          const positions = warpLinesRef.current.geometry.attributes.position.array as Float32Array;
          for (let i = 0; i < positions.length / 6; i++) {
            // Pull points outwards with velocity vectors
            const sxIdx = i * 6;
            const exIdx = i * 6 + 3;

            const vx = positions[exIdx] - positions[sxIdx];
            const vy = positions[exIdx + 1] - positions[sxIdx + 1];
            const vz = positions[exIdx + 2] - positions[sxIdx + 2];

            // Stretch the tail backwards much longer
            positions[sxIdx] += vx * 0.25;
            positions[sxIdx + 1] += vy * 0.25;
            positions[sxIdx + 2] += vz * 0.25;

            positions[exIdx] += vx * 0.4;
            positions[exIdx + 1] += vy * 0.4;
            positions[exIdx + 2] += vz * 0.4;

            // Loop reset if they burst beyond range
            const len = Math.sqrt(positions[exIdx]**2 + positions[exIdx+1]**2 + positions[exIdx+2]**2);
            if (len > 350) {
              const resetDir = new THREE.Vector3(
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2
              ).normalize();
              const startDist = 15 + Math.random() * 10;
              
              positions[sxIdx] = resetDir.x * startDist;
              positions[sxIdx+1] = resetDir.y * startDist;
              positions[sxIdx+2] = resetDir.z * startDist;

              positions[exIdx] = resetDir.x * (startDist + 1);
              positions[exIdx+1] = resetDir.y * (startDist + 1);
              positions[exIdx+2] = resetDir.z * (startDist + 1);
            }
          }
          warpLinesRef.current.geometry.attributes.position.needsUpdate = true;
        } else if (travelState === 'decelerating') {
          warpMat.opacity = THREE.MathUtils.lerp(warpMat.opacity, 0.05, 0.15);
        } else {
          warpMat.opacity = 0;
        }
      }

      // PLANETS PHYSICS & SPINNING
      PLANETS_DATA.forEach((data) => {
        const pGroup = planetMeshesRef.current[data.id];
        if (!pGroup) return;

        // Orbit update
        if (isPlaying) {
          planetAnglesRef.current[data.id] += data.orbitSpeed * runSpeedMultiplier * 0.8 * delta;
        }

        const angle = planetAnglesRef.current[data.id];
        const targetX = data.orbitRadius * Math.cos(angle);
        const targetZ = data.orbitRadius * Math.sin(angle);

        // Update positions
        pGroup.position.set(targetX, 0, targetZ);

        // Rotate individual planet mesh on its own tilted axis
        const sphereMesh = pGroup.getObjectByName('planet_sphere') as THREE.Mesh;
        if (sphereMesh) {
          sphereMesh.rotation.y += data.rotationSpeed * (isPlaying ? 1.0 : 0) * 1.5 * delta * 50;
        }

        // Earth atmospheric cloud layer slow shift
        const cloudMesh = cloudsMeshesRef.current[data.id];
        if (cloudMesh) {
          cloudMesh.rotation.y += (data.rotationSpeed * 1.25) * (isPlaying ? 1 : 0) * delta * 50;
        }
      });

      // SYNC EXPOLODED STRUCTURE COORDINATES (FOLLOW SLIDING GROUP OVER Orbit)
      if (explodedGroupRef.current && selectedPlanet && structureMode) {
        const baseGroup = planetMeshesRef.current[selectedPlanet.id];
        if (baseGroup) {
          explodedGroupRef.current.position.copy(baseGroup.position);
          // Gently rotate innermost structural layers for visual dynamism
          explodedGroupRef.current.children.forEach((mesh) => {
            if (mesh instanceof THREE.Mesh && mesh.name !== 'planet_sphere' && mesh.geometry instanceof THREE.SphereGeometry) {
              mesh.rotation.z += 0.002 * runSpeedMultiplier;
            }
          });
        }
      }

      // CAMERA INTERPOLATIONS & TARGETING LOGIC
      let targetCameraPosition = new THREE.Vector3();
      let targetLookAt = new THREE.Vector3(0, 0, 0);

      if (selectedPlanet) {
        // Target is active planet group
        const planetGroup = planetMeshesRef.current[selectedPlanet.id];
        if (planetGroup) {
          const pWorldPos = new THREE.Vector3();
          planetGroup.getWorldPosition(pWorldPos);
          targetLookAt.copy(pWorldPos);

          if (activeTracking) {
            // Tight close-up circular orbit around planet
            const relativeDistance = selectedPlanet.sizeScale * 5.5 + 4.5;
            
            // Derive camera direction from spherical polar angles
            const cX = pWorldPos.x + relativeDistance * Math.sin(cameraRotation.current.phi) * Math.cos(cameraRotation.current.theta);
            const cY = pWorldPos.y + relativeDistance * Math.cos(cameraRotation.current.phi);
            const cZ = pWorldPos.z + relativeDistance * Math.sin(cameraRotation.current.phi) * Math.sin(cameraRotation.current.theta);

            targetCameraPosition.set(cX, cY, cZ);

            // Interpolate smoothly
            if (travelState === 'warping') {
              // Quick glide
              camera.position.lerp(targetCameraPosition, 0.08);
            } else {
              // Solid lock
              camera.position.lerp(targetCameraPosition, 0.15);
            }
          }
        }
      } else {
        // Dynamic overall system view
        targetLookAt.set(0, 0, 0);
        
        const systemX = cameraRotation.current.radius * Math.sin(cameraRotation.current.phi) * Math.cos(cameraRotation.current.theta);
        const systemY = cameraRotation.current.radius * Math.cos(cameraRotation.current.phi);
        const systemZ = cameraRotation.current.radius * Math.sin(cameraRotation.current.phi) * Math.sin(cameraRotation.current.theta);

        targetCameraPosition.set(systemX, systemY, systemZ);
        camera.position.lerp(targetCameraPosition, 0.07);
      }

      // Dynamic LookAt easing
      const currentLookAt = new THREE.Vector3();
      const lookTarget = new THREE.Object3D();
      lookTarget.position.copy(camera.position);

      // Create a temporary focal point smoothly lerped
      const lastLookAt = (camera as any).lastLookAt || new THREE.Vector3(0, 0, 0);
      lastLookAt.lerp(targetLookAt, 0.1);
      camera.lookAt(lastLookAt);
      (camera as any).lastLookAt = lastLookAt;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying, simSpeed, selectedPlanet, activeTracking, travelState, structureMode]);

  // Handle Resize updates seamlessly
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;

      cameraRef.current.aspect = width / height;
      cameraRef.current.updateProjectionMatrix();

      rendererRef.current.setSize(width, height);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // MOUSE DRAGGING ROTATION AND PAN CHAMBERS
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    previousMousePosition.current = {
      x: e.clientX,
      y: e.clientY
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;

    const deltaX = e.clientX - previousMousePosition.current.x;
    const deltaY = e.clientY - previousMousePosition.current.y;

    // Mutate camera angle parameters directly
    cameraRotation.current.theta -= deltaX * 0.007;
    // Lock phi boundaries to prevent flip-overs
    cameraRotation.current.phi = Math.max(0.08, Math.min(Math.PI - 0.08, cameraRotation.current.phi - deltaY * 0.007));

    previousMousePosition.current = {
      x: e.clientX,
      y: e.clientY
    };
  };

  const handleMouseUpOrLeave = () => {
    isDragging.current = false;
  };

  // TOUCH SUPPORT FOR CANVAS
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length !== 1) return;
    isDragging.current = true;
    previousMousePosition.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - previousMousePosition.current.x;
    const deltaY = e.touches[0].clientY - previousMousePosition.current.y;

    cameraRotation.current.theta -= deltaX * 0.01;
    cameraRotation.current.phi = Math.max(0.1, Math.min(Math.PI - 0.1, cameraRotation.current.phi - deltaY * 0.01));

    previousMousePosition.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY
    };
  };

  // ZOOM CONTROLS
  const handleZoom = (direction: 'in' | 'out') => {
    const minZoom = selectedPlanet ? selectedPlanet.sizeScale * 3.5 : 20;
    const maxZoom = selectedPlanet ? selectedPlanet.sizeScale * 25 : 220;

    if (selectedPlanet) {
      // Zoom changes camera distance coordinates
      cameraRotation.current.radius = THREE.MathUtils.clamp(
        cameraRotation.current.radius + (direction === 'in' ? -1.5 : 1.5),
        2, 40
      );
    } else {
      cameraRotation.current.radius = THREE.MathUtils.clamp(
        cameraRotation.current.radius + (direction === 'in' ? -8 : 8),
        minZoom,
        maxZoom
      );
    }
  };

  return (
    <div className="relative w-full h-full select-none" id="renderer-parent-panel">
      {/* 3D CANVAS STAGE */}
      <div 
        ref={containerRef}
        className="w-full h-full cursor-grab active:cursor-grabbing bg-[#050816]"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onMouseLeave={handleMouseUpOrLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUpOrLeave}
        id="solar-system-3d-canvas"
      />

      {/* SPACE TRAVEL HYPERDRIVE BANNER */}
      {travelState === 'warping' && (
        <div id="warp-speed-alert" className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 pointer-events-none backdrop-blur-[2px] transition-all duration-300">
          <div className="text-cyan-400 font-mono text-lg font-bold tracking-[0.4em] animate-pulse flex items-center gap-3">
            <Compass className="animate-spin text-cyan-300" size={24} />
            ENGAGING HYPERDRIVE ACCELERATION
          </div>
          <div className="text-gray-400 font-mono text-xs mt-2 tracking-wider">
            RECONFIGURING SCIENTIFIC APERTURES TOWARDS {selectedPlanet?.name.toUpperCase()}...
          </div>
        </div>
      )}

      {/* CONTROL BOARD (SANDBOX FLOATING WIDGET) */}
      <div 
        id="spacecraft-control-board" 
        className="absolute bottom-6 left-6 flex flex-wrap items-center gap-3 bg-[#0A1128]/85 border border-[#00E5FF]/20 px-4 py-3 rounded-xl backdrop-blur-md shadow-2xl shadow-indigo-950/50 text-white select-none z-10 sm:max-w-md lg:max-w-2xl"
      >
        <span className="text-[10px] uppercase font-mono tracking-widest text-[#00E5FF] w-full border-b border-white/10 pb-1 mb-1 block">
          Spacecraft Systems Command
        </span>
        
        {/* Playback Button */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className={`flex items-center justify-center p-2 rounded-lg border transition-all duration-300 ${
            isPlaying 
              ? 'bg-[#00E5FF]/20 border-[#00E5FF]/40 text-[#00E5FF] hover:bg-[#00E5FF]/30' 
              : 'bg-white/5 border-white/25 text-white hover:bg-white/10'
          }`}
          title={isPlaying ? 'Pause Simulation' : 'Resume Simulation'}
          id="btn-play-pause-sim"
        >
          {isPlaying ? <Pause size={16} /> : <Play size={16} />}
        </button>

        {/* Speed Controls */}
        <div className="flex items-center gap-2 border-r border-white/10 pr-3">
          <span className="text-[10px] font-mono text-gray-400 uppercase">Speed:</span>
          {[0.5, 1.0, 2.5, 5.0].map((speeds) => (
            <button
              key={speeds}
              onClick={() => {
                setSimSpeed(speeds);
                setIsPlaying(true);
              }}
              className={`text-xs px-2 py-1 font-mono rounded transition-all duration-150 ${
                simSpeed === speeds && isPlaying
                  ? 'bg-[#00E5FF]/20 text-[#00E5FF] border border-[#00E5FF]/40 font-bold'
                  : 'text-gray-400 hover:text-white border border-transparent'
              }`}
              id={`btn-speed-${speeds}`}
            >
              {speeds}x
            </button>
          ))}
        </div>

        {/* Toggle Orbits */}
        <button
          onClick={() => setShowOrbits(!showOrbits)}
          className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border transition-all duration-200 ${
            showOrbits 
              ? 'bg-[#00E5FF]/10 border-[#00E5FF]/30 text-white' 
              : 'bg-gray-900/40 border-white/10 text-gray-400'
          }`}
          id="btn-toggle-orbits"
        >
          <Video size={13} className={showOrbits ? 'text-[#00E5FF]' : ''} />
          Orbits
        </button>

        {/* Reset Camera Orbit */}
        <button
          onClick={() => {
            cameraRotation.current.phi = Math.PI / 3;
            cameraRotation.current.theta = Math.PI / 4;
            cameraRotation.current.radius = selectedPlanet ? selectedPlanet.sizeScale * 5.5 + 4.5 : 65;
            setActiveTracking(true);
          }}
          className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg bg-gray-950/60 border border-white/10 text-gray-400 hover:text-white hover:border-white/30 transition-all duration-200"
          id="btn-reset-cam"
        >
          <RotateCcw size={13} />
          Reset Camera
        </button>

        {/* Free Fly / Track Toggler */}
        {selectedPlanet && (
          <button
            onClick={() => setActiveTracking(!activeTracking)}
            className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border transition-all duration-200 ${
              activeTracking
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
            }`}
            id="btn-toggle-camera-track"
          >
            <Eye size={13} />
            {activeTracking ? 'Bound Tracking' : 'Free Orbit'}
          </button>
        )}

        {/* Interactive Zoom Buttons */}
        <div className="flex gap-1.5 ml-auto border-l border-white/10 pl-3">
          <button 
            onClick={() => handleZoom('in')}
            className="p-1 px-2 rounded bg-white/5 border border-white/10 hover:bg-white/15 text-gray-300 text-xs flex items-center justify-center"
            id="btn-zoom-in"
          >
            <ZoomIn size={13} />
          </button>
          <button 
            onClick={() => handleZoom('out')}
            className="p-1 px-2 rounded bg-white/5 border border-white/10 hover:bg-white/15 text-gray-300 text-xs flex items-center justify-center"
            id="btn-zoom-out"
          >
            <ZoomOut size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};
