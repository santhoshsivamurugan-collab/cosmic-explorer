/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface StructureLayer {
  name: string;
  description: string;
  thickness: string;
  temperature: string;
  composition: string;
  color: string;
  radiusRatio: number; // Outer boundary as ratio (0.0 to 1.0)
}

export interface PlanetMoons {
  count: number;
  notable: string[];
}

export interface PlanetData {
  id: string;
  name: string;
  color: string;
  colorHex: string;
  distanceFromSun: string;
  diameter: string;
  mass: string;
  gravity: string;
  temperature: string;
  orbitalPeriod: string;
  rotationPeriod: string;
  moons: PlanetMoons;
  funFacts: string[];

  // 3D Rendering Configurations
  sizeScale: number;
  orbitRadius: number;
  orbitSpeed: number;
  rotationSpeed: number;
  tilt: number; // In degrees
  texturePattern: 'crater' | 'glowing_atmosphere' | 'clouds' | 'dust_red' | 'gas_bands_jupiter' | 'gas_bands_saturn' | 'ice_blue' | 'deep_blue';
  hasAtmosphereGlow?: boolean;
  atmosphereColor?: string;
  hasClouds?: boolean;
  hasRings?: boolean;
  ringColor?: string;
  ringRadiusInner?: number;
  ringRadiusOuter?: number;

  // Section 2 Encyclopedia Details
  overview: string;
  formation: string;
  atmosphereComposition: string;
  surfaceConditions: string;
  scientificFacts: string[];

  // Section 1 Internal Structure Layers
  layers: StructureLayer[];
}

export interface SpaceFact {
  id: string;
  category: 'planet' | 'sun' | 'system' | 'mission';
  categoryLabel: string;
  title: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  category: 'basics' | 'structures' | 'facts' | 'astronomy';
  difficulty: 'easy' | 'medium' | 'hard';
  explanation: string;
}

export type SpaceRank = 'Cadet' | 'Explorer' | 'Planet Specialist' | 'Space Commander';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconName: string;
  unlocked: boolean;
}
