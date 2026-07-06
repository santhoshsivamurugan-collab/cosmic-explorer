/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PlanetData, SpaceFact, QuizQuestion } from './types';

export const PLANETS_DATA: PlanetData[] = [
  {
    id: 'mercury',
    name: 'Mercury',
    color: 'slate-400',
    colorHex: '#9E9E9E',
    distanceFromSun: '57.9 Million km',
    diameter: '4,879 km',
    mass: '3.285 x 10^23 kg (0.055 Earths)',
    gravity: '3.7 m/s² (0.38 g)',
    temperature: '-180°C to 430°C',
    orbitalPeriod: '88 Earth Days',
    rotationPeriod: '59 Earth Days',
    moons: { count: 0, notable: [] },
    funFacts: [
      'Mercury is the closest planet to the Sun, but not the hottest (Venus is sweeter!).',
      'A year on Mercury is just 88 Earth days, but a single day-night cycle takes 176 Earth days!',
      'It has the thinnest atmosphere of any planet, exposing it to massive solar radiation and asteroid collisions.'
    ],
    sizeScale: 0.38,
    orbitRadius: 18,
    orbitSpeed: 0.04,
    rotationSpeed: 0.004,
    tilt: 0.03,
    texturePattern: 'crater',
    overview: 'Mercury is the smallest planet in our Solar System and the closest to the Sun. It is a gaseous-depleted, heavily cratered rocky world that endures extreme temperature swings from boiling days to liquid-nitrogen freezings at night.',
    formation: 'Formed approximately 4.5 billion years ago when gravity pulled swirling gas and dust in to create this small, core-rich rocky world near the infant Sun.',
    atmosphereComposition: 'Virtually non-existent. It has a thin, unstable exosphere composed of atoms blasted off its surface by space radiation and solar wind, containing trace amounts of oxygen, sodium, hydrogen, helium, and potassium.',
    surfaceConditions: 'A silent, airless wasteland cover in craters, ridges, and vast volcanic plains. High-energy solar radiation pierces the surface, with no atmosphere to trap heat or insulate.',
    scientificFacts: [
      'Its massive metallic iron core occupies 85% of its total planetary radius.',
      'Despite proximity to the Sun, radar imaging indicates water ice sheets exist in deep, permanently shadowed polar craters.',
      'Mercury is slowly shrinking; its core cooling has caused the crust to contract, creating towering escarpments.'
    ],
    layers: [
      {
        name: 'Crust',
        description: 'A silicate rock shell scarred by impacts and tectonic contractions.',
        thickness: '35 km',
        temperature: '-180°C to 430°C',
        composition: 'Sodium, magnesium, silicon, oxygen',
        color: '#7D7D7D',
        radiusRatio: 1.0
      },
      {
        name: 'Mantle',
        description: 'A solid, rocky silicate mantle once active with early volcanism.',
        thickness: '400 km',
        temperature: '500°C to 1,000°C',
        composition: 'Rocky silicates, rich in iron compounds',
        color: '#B57A50',
        radiusRatio: 0.9
      },
      {
        name: 'Core',
        description: 'An immense, partially molten iron core driving a weak magnetic field.',
        thickness: '2,024 km',
        temperature: '1,500°C to 2,200°C',
        composition: 'Liquid and solid iron, nickel, sulfur',
        color: '#D44A1C',
        radiusRatio: 0.72
      }
    ]
  },
  {
    id: 'venus',
    name: 'Venus',
    color: 'amber-600',
    colorHex: '#D48C46',
    distanceFromSun: '108.2 Million km',
    diameter: '12,104 km',
    mass: '4.867 x 10^24 kg (0.815 Earths)',
    gravity: '8.87 m/s² (0.90 g)',
    temperature: '462°C',
    orbitalPeriod: '225 Earth Days',
    rotationPeriod: '243 Earth Days (Retrograde)',
    moons: { count: 0, notable: [] },
    funFacts: [
      'Venus is the hottest planet in our solar system due to a runaway greenhouse effect.',
      'It rotates backwards (clockwise) on its axis, meaning the Sun rises in the west and sets in the east.',
      'A day on Venus is longer than its entire year!'
    ],
    sizeScale: 0.95,
    orbitRadius: 28,
    orbitSpeed: 0.015,
    rotationSpeed: -0.002, // retrograde
    tilt: 177.3,
    texturePattern: 'glowing_atmosphere',
    hasAtmosphereGlow: true,
    atmosphereColor: '#F2A054',
    overview: 'Often referred to as Earth\'s twin due to similar mass and size, Venus is instead a toxic greenhouse hellscape. Underneath its thick reflective clouds of sulfuric acid, atmospheric pressures crush like ocean depths, and surface heat melts lead.',
    formation: 'Accreted alongside Earth in the inner solar system, starting with similar ocean-bearing potential, which was subsequently boiled away when hot ultraviolet rays triggered a runaway greenhouse storm.',
    atmosphereComposition: '96.5% Carbon Dioxide, 3.5% Nitrogen, with blanketing clouds of highly corrosive sulfuric acid droplets.',
    surfaceConditions: 'A searing, dry, volcanic plain shrouded in orange-tinted twilight. Atmospheric pressure is 92 times that of Earth, equal to diving 1 km deep into an ocean.',
    scientificFacts: [
      'Venus has more volcanic structures than any other planet, with over 1,600 major volcanoes mapped.',
      'The planet possesses no intrinsic planetary-scale magnetic field due to sluggish core heat convection.',
      'Super-rotation: its clouds circle the planet in just 4 Earth days, driven by gale-force winds up to 360 km/h.'
    ],
    layers: [
      {
        name: 'Atmosphere',
        description: 'An extremely dense gas layer trapping heat in a runaway greenhouse effect.',
        thickness: '100 km',
        temperature: '462°C (at surface)',
        composition: '96.5% Carbon Dioxide, 3.5% Nitrogen',
        color: '#E0A96D',
        radiusRatio: 1.0
      },
      {
        name: 'Crust',
        description: 'A basaltic rocky crust continuously deformed by intense tectonic stress.',
        thickness: '30 km',
        temperature: '462°C to 480°C',
        composition: 'Basalt, silicate rock',
        color: '#8C5638',
        radiusRatio: 0.98
      },
      {
        name: 'Mantle',
        description: 'A convective rock mantle sluggishly transporting radioactive thermal heat.',
        thickness: '3,000 km',
        temperature: '1,000°C to 2,500°C',
        composition: 'Rocky silicates, iron/magnesium oxides',
        color: '#BE4A27',
        radiusRatio: 0.95
      },
      {
        name: 'Core',
        description: 'A liquid metallic iron-nickel core devoid of thermal convective dynamo.',
        thickness: '3,000 km',
        temperature: '3,000°C to 4,500°C',
        composition: 'Iron, nickel, iron sulfide',
        color: '#EC8B22',
        radiusRatio: 0.5
      }
    ]
  },
  {
    id: 'earth',
    name: 'Earth',
    color: 'blue-500',
    colorHex: '#3A86C8',
    distanceFromSun: '149.6 Million km',
    diameter: '12,742 km',
    mass: '5.972 x 10^24 kg',
    gravity: '9.81 m/s²',
    temperature: '-89°C to 58°C (Average 15°C)',
    orbitalPeriod: '365.25 Days',
    rotationPeriod: '24 Hours',
    moons: { count: 1, notable: ['Luna (The Moon)'] },
    funFacts: [
      'Earth is the only known planet to harbor liquid dynamic oceans and complex organisms.',
      'Our atmospheric dome blocks lethal solar ultraviolet waves and burns up meteors as shooting stars.',
      'Earth is the only planet not named after a mythological god or goddess.'
    ],
    sizeScale: 1.0,
    orbitRadius: 38,
    orbitSpeed: 0.01,
    rotationSpeed: 0.01,
    tilt: 23.44,
    texturePattern: 'clouds',
    hasAtmosphereGlow: true,
    atmosphereColor: '#60A5FA',
    hasClouds: true,
    overview: 'Our home planetary oasis, Earth is a brilliant blue-and-white orb drifting in the deep dark. Centering active plate tectonics, rich liquid water oceans, and a robust oxygen-nitrogen atmosphere, it hosts millions of biological species.',
    formation: 'Coalesced 4.54 billion years ago from the solar nebula. Chemical accretion of rocky debris was later bombarded by gaseous water-carrying comets and early chemical mixers.',
    atmosphereComposition: '78% Nitrogen, 21% Oxygen, 0.9% Argon, 0.04% Carbon Dioxide, with volatile water vapor cycles.',
    surfaceConditions: 'A dynamic, highly biological interface of deep saline oceans, high continental granite plates, lush forests, ice sheets, and rolling tectonic mountain ranges.',
    scientificFacts: [
      'Earth is the densest planet in the Solar System, boasting the highest rocky core compaction.',
      'Our protective magnetosphere is generated deep below in our rotating, churning liquid metal outer core.',
      'Tectonic plates slide and drift across the softer asthenosphere at a similar rate to fingernail growth.'
    ],
    layers: [
      {
        name: 'Crust',
        description: 'A solid continental granite and oceanic basalt plate layer supporting biosphere life.',
        thickness: '5 to 70 km',
        temperature: '15°C to 400°C',
        composition: 'Oxygen, silicon, aluminum, iron, calcium',
        color: '#553C35',
        radiusRatio: 1.0
      },
      {
        name: 'Mantle',
        description: 'A massive viscous silicate rock layer driving continental plate drift.',
        thickness: '2,890 km',
        temperature: '500°C to 4,000°C',
        composition: 'Iron and magnesium silicates (olivine, pyroxene)',
        color: '#C0392B',
        radiusRatio: 0.98
      },
      {
        name: 'Outer Core',
        description: 'A vigorously churning liquid iron-nickel mass generating Earth\'s magnetic field.',
        thickness: '2,260 km',
        temperature: '4,000°C to 5,500°C',
        composition: 'Liquid iron, nickel, light chemical trace metals',
        color: '#F39C12',
        radiusRatio: 0.54
      },
      {
        name: 'Inner Core',
        description: 'A solid metallic sphere pressurized by gravitational weights to crystallization.',
        thickness: '1,220 km',
        temperature: '5,500°C to 6,000°C',
        composition: 'Solid iron, crystallizing nickel alloy',
        color: '#FFEAAA',
        radiusRatio: 0.2
      }
    ]
  },
  {
    id: 'mars',
    name: 'Mars',
    color: 'red-500',
    colorHex: '#C0593B',
    distanceFromSun: '227.9 Million km',
    diameter: '6,779 km',
    mass: '6.39 x 10^23 kg (0.107 Earths)',
    gravity: '3.72 m/s² (0.38 g)',
    temperature: '-143°C to 35°C (Average -62°C)',
    orbitalPeriod: '687 Earth Days',
    rotationPeriod: '24.6 Hours',
    moons: { count: 2, notable: ['Phobos', 'Deimos'] },
    funFacts: [
      'Mars is covered in iron oxide (rust) dust, giving its beautiful rust-red cinematic glow.',
      'It contains the solar system\'s highest mountain, Olympus Mons, a volcano three times taller than Mount Everest!',
      'Frozen polar water ice exists beneath the dry CO2 ice sheets and surface dirt.'
    ],
    sizeScale: 0.53,
    orbitRadius: 48,
    orbitSpeed: 0.008,
    rotationSpeed: 0.009,
    tilt: 25.19,
    texturePattern: 'dust_red',
    hasAtmosphereGlow: true,
    atmosphereColor: '#FFA384',
    overview: 'Mars is a cold, dry, orange-red desert world of wind-carved canyons and towering inactive shield volcanoes. Subject to immense localized dust storms, it is currently the primary focus for human interplanetary colonization.',
    formation: 'Formed from outer accretion rings, its growth arrested early due to gravitational tidal disruptions from neighboring massive gas giant, Jupiter.',
    atmosphereComposition: '95.3% Carbon Dioxide, 2.7% Nitrogen, 1.6% Argon, with trace water and carbon monoxide molecules.',
    surfaceConditions: 'A frozen landscape covered in red hematite sands. Features deep trench lines like Valles Marineris and massive crater impact fields.',
    scientificFacts: [
      'Its thin atmosphere is slowly stripped away by solar wind due to a lack of global dipolar magnetic shielding.',
      'Mars features robotic active settlements—currently entirely populated by exploratory motorized rovers and landers.',
      'Phobos orbits so closely to Mars that it will eventually be torn apart into a planetary debris ring.'
    ],
    layers: [
      {
        name: 'Crust',
        description: 'A solid, iron-rich basaltic shell covered in volcanic dust and loose sand.',
        thickness: '50 km',
        temperature: '-143°C to 35°C',
        composition: 'Basalt, iron oxides, clay, sulfur compounds',
        color: '#9C3D24',
        radiusRatio: 1.0
      },
      {
        name: 'Mantle',
        description: 'A quiet, rocky silicate mantle containing radioactive chemical elements.',
        thickness: '1,600 km',
        temperature: '1,200°C to 1,800°C',
        composition: 'Rocky silicates, rich in iron minerals',
        color: '#7A1C16',
        radiusRatio: 0.96
      },
      {
        name: 'Core',
        description: 'A solid/sluggish core containing elements that lower its freezing point.',
        thickness: '1,790 km',
        temperature: '1,800°C to 2,000°C',
        composition: 'Iron, nickel, sulfur compounds',
        color: '#D15822',
        radiusRatio: 0.52
      }
    ]
  },
  {
    id: 'jupiter',
    name: 'Jupiter',
    color: 'orange-400',
    colorHex: '#D1B48C',
    distanceFromSun: '778.5 Million km',
    diameter: '139,820 km',
    mass: '1.898 x 10^27 kg (317.8 Earths)',
    gravity: '24.79 m/s² (2.53 g)',
    temperature: '-110°C',
    orbitalPeriod: '12 Earth Years',
    rotationPeriod: '9.9 Hours',
    moons: { count: 95, notable: ['Ganymede', 'Callisto', 'Io', 'Europa'] },
    funFacts: [
      'Jupiter is a planetary defense shield, its immense mass deflecting inward-bound solar system comets.',
      'The iconic Great Red Spot is a giant anticyclonic hurricane storm twice the size of Earth, spinning for over 300 years!',
      'Jupiter spins faster than any other planet, creating compressed 10-hour days.'
    ],
    sizeScale: 2.2, // scaled for display
    orbitRadius: 65,
    orbitSpeed: 0.004,
    rotationSpeed: 0.02,
    tilt: 3.13,
    texturePattern: 'gas_bands_jupiter',
    overview: 'Jupiter is the supreme gas colossus of the solar system, making up more than double the combined mass of all other planets combined. Lacking any solid surface, it is a churn of colorful hydrogen storms and deep high-pressure liquid metallic tides.',
    formation: 'Swept up the vast majority of residual gas and nebular dust following solar birth, rapidly growing dense enough to pull in vast envelopes of hydrogen-helium gases.',
    atmosphereComposition: '89.8% Hydrogen, 10.2% Helium, with active chemical layers of ammonia ice, ammonium hydrosulfide, and water clouds.',
    surfaceConditions: 'Dynamic, violent jet-streams of orange and white gas bands. Pressures increase smoothly into supercritical liquid metal zones—no actual solid floor exists.',
    scientificFacts: [
      'The moon Ganymede is the largest moon in our stellar neighborhood, larger than the planet Mercury.',
      'Jupiter generates an incredibly powerful magnetosphere, emitting violent radio wave noise.',
      'Under deep interior pressure, liquid hydrogen conducts electricity like a flowing metallic pool.'
    ],
    layers: [
      {
        name: 'Upper Atmosphere',
        description: 'Turbulent gas storms forming distinct colorful horizontal bands and towering swirling vortexes.',
        thickness: '5,000 km',
        temperature: '-150°C to -110°C',
        composition: 'Gaseous hydrogen, helium, ammonia crystals',
        color: '#D4AC0D',
        radiusRatio: 1.0
      },
      {
        name: 'Molecular Hydrogen Layer',
        description: 'A pressurized sea of fluid molecular hydrogen that behaves like a gas-liquid hybrid medium.',
        thickness: '15,000 km',
        temperature: '-110°C to 10,000°C',
        composition: 'Liquid molecular hydrogen and dissolved helium',
        color: '#E59866',
        radiusRatio: 0.92
      },
      {
        name: 'Metallic Hydrogen Layer',
        description: 'Extreme pressure squeezes atoms into an electrically conductive liquid metal ocean. Generates the massive dynamo.',
        thickness: '40,000 km',
        temperature: '10,000°C to 20,000°C',
        composition: 'Liquid ionized metallic hydrogen and helium rain',
        color: '#7D6608',
        radiusRatio: 0.72
      },
      {
        name: 'Core',
        description: 'A dense, highly pressurized core of heavy elements slowly dissolving into the metallic hydrogen.',
        thickness: '14,000 km',
        temperature: '20,000°C to 35,000°C',
        composition: 'Highly compressed iron, nickel, silicates, and ice',
        color: '#1F385C',
        radiusRatio: 0.2
      }
    ]
  },
  {
    id: 'saturn',
    name: 'Saturn',
    color: 'yellow-600',
    colorHex: '#EAE19E',
    distanceFromSun: '1.434 Billion km',
    diameter: '116,460 km',
    mass: '5.683 x 10^26 kg (95.2 Earths)',
    gravity: '10.44 m/s² (1.06 g)',
    temperature: '-140°C',
    orbitalPeriod: '29 Earth Years',
    rotationPeriod: '10.7 Hours',
    moons: { count: 146, notable: ['Titan', 'Enceladus', 'Mimas', 'lapetus'] },
    funFacts: [
      'Saturn is the least dense planet—so light it could theoretically float inside a cosmic swimming pool!',
      'Its spectacular ring system is made of billions of ice crystal shards and space dust chunks.',
      'Titan, its largest moon, is shrouded in a thick nitrogen dome with liquid methane lakes.'
    ],
    sizeScale: 1.8,
    orbitRadius: 82,
    orbitSpeed: 0.002,
    rotationSpeed: 0.018,
    tilt: 26.73,
    texturePattern: 'gas_bands_saturn',
    hasRings: true,
    ringColor: '#D2C29D',
    ringRadiusInner: 2.2,
    ringRadiusOuter: 4.5,
    overview: 'Universally recognized by its magnificent glittering ring system, Saturn is a majestic gaseous world of pale yellow hue. Winds in Saturn\'s high atmosphere reach speeds up to 1,800 km/h, far swifter than those on Jupiter.',
    formation: 'Coalesced in the colder regions of the outer solar nebula, gathering vast quantities of gaseous hydrogen and water ice particles.',
    atmosphereComposition: '96.3% Hydrogen, 3.2% Helium, with trace methane, ammonia, and ethane gas clouds.',
    surfaceConditions: 'An ocean of gas giving way smoothly to dense high-pressure liquid metal, whipped by supersonic storms.',
    scientificFacts: [
      'The rings span up to 282,000 km in width but average a razor-thin thickness of only 10 meters.',
      'Enceladus sprays active liquid water plumes into space from hydrothermal vents beneath its global icy crust.',
      'Saturn\'s north pole hosts a mysterious, permanent hexagonal-shaped swirling atmospheric wave structure.'
    ],
    layers: [
      {
        name: 'Atmosphere',
        description: 'Outer molecular gas layer marked by low-contrast pale bands and ammonia haze waves.',
        thickness: '1,000 km',
        temperature: '-140°C',
        composition: 'Hydrogen, helium, trace ammonia',
        color: '#D4C39D',
        radiusRatio: 1.0
      },
      {
        name: 'Hydrogen Layer',
        description: 'A vast fluid ocean of molecular hydrogen under intermediate levels of gravity compaction.',
        thickness: '30,000 km',
        temperature: '-140°C to 6,000°C',
        composition: 'Liquid molecular hydrogen and dissolved helium',
        color: '#A2906E',
        radiusRatio: 0.98
      },
      {
        name: 'Metallic Core',
        description: 'Churning, pressurized liquid metallic hydrogen and falling helium rain compounds.',
        thickness: '15,000 km',
        temperature: '6,000°C to 11,700°C',
        composition: 'Liquid metallic hydrogen, nickel-iron traces',
        color: '#65573B',
        radiusRatio: 0.46
      },
      {
        name: 'Ring Structure',
        description: 'Billions of icy particles and rock grains orbiting in a thin, equatorial sheet.',
        thickness: '10 meters (avg)',
        temperature: '-180°C',
        composition: '99% water ice flakes, amorphous carbon, rocky dust',
        color: '#CBB294',
        radiusRatio: 0.01 // special visual flag
      }
    ]
  },
  {
    id: 'uranus',
    name: 'Uranus',
    color: 'teal-400',
    colorHex: '#A2D3C4',
    distanceFromSun: '2.871 Billion km',
    diameter: '50,724 km',
    mass: '8.681 x 10^25 kg (14.5 Earths)',
    gravity: '8.69 m/s² (0.89 g)',
    temperature: '-224°C',
    orbitalPeriod: '84 Earth Years',
    rotationPeriod: '17.2 Hours (Retrograde)',
    moons: { count: 28, notable: ['Titania', 'Oberon', 'Ariel', 'Umbriel', 'Miranda'] },
    funFacts: [
      'Uranus is uniquely tilted on its side (98 degrees), orbiting the Sun like a rolling bowling ball!',
      'It has the coldest planetary atmospheric temperatures of any solar system planet.',
      'Uranus is accompanied by 13 faint rings that are extremely dark and narrow.'
    ],
    sizeScale: 1.2,
    orbitRadius: 98,
    orbitSpeed: 0.001,
    rotationSpeed: -0.012, // retrograde
    tilt: 97.77, // rolling ball
    texturePattern: 'ice_blue',
    hasAtmosphereGlow: true,
    atmosphereColor: '#80DEEA',
    overview: 'Uranus is a giant pale-cyan sphere composed of thick, icy volatiles. Unlike the gas giants, its rocky core is buffered by a massive chemical slush of sloshing water, ammonia, and methane ice crystals.',
    formation: 'Accreted outer solar system volatile compounds. A colossal proto-planet collision during development is thought to have knocked it on its side.',
    atmosphereComposition: '82.5% Hydrogen, 15.2% Helium, 2.3% Methane, which absorbs orange wavelengths to reflect cyan hues.',
    surfaceConditions: 'A silent, deeply frozen gaseous ocean. The exterior is incredibly smooth and featureless compared to other giants.',
    scientificFacts: [
      'Because of its extreme axial tilt, a single polar night lasts for an incredible 42 Earth years.',
      'The magnetic field is asymmetric, offset from the planet\'s center, and tilted 60 degrees away.',
      'Methane chemical compaction causes storms that rain solid crystals of diamond through its mantle.'
    ],
    layers: [
      {
        name: 'Atmosphere',
        description: 'A deep, serene cyan gaseous layer of hydrogen, helium, and haze-blocking methane.',
        thickness: '5,000 km',
        temperature: '-224°C to -150°C',
        composition: 'Hydrogen, helium, methane ice crystals',
        color: '#64C8C8',
        radiusRatio: 1.0
      },
      {
        name: 'Ice Mantle',
        description: 'A dense, high-conductivity slush of hot, dense water-ammonia-methane ionic fluid, often called a water-ammonia ocean.',
        thickness: '15,000 km',
        temperature: '2,000°C to 5,000°C',
        composition: 'Superheated water, ammonia, methane, sulfur',
        color: '#2E808C',
        radiusRatio: 0.8
      },
      {
        name: 'Core',
        description: 'A dense, rocky silicates and iron-nickel mineral core occupying compressed center volumes.',
        thickness: '5,000 km',
        temperature: '5,000°C',
        composition: 'Iron-silicate rock, nickel compounds',
        color: '#1B3D4F',
        radiusRatio: 0.2
      }
    ]
  },
  {
    id: 'neptune',
    name: 'Neptune',
    color: 'blue-700',
    colorHex: '#274EAB',
    distanceFromSun: '4.495 Billion km',
    diameter: '49,244 km',
    mass: '1.024 x 10^26 kg (17.1 Earths)',
    gravity: '11.15 m/s² (1.14 g)',
    temperature: '-214°C',
    orbitalPeriod: '164.8 Earth Years',
    rotationPeriod: '16.1 Hours',
    moons: { count: 16, notable: ['Triton', 'Nereid', 'Proteus'] },
    funFacts: [
      'Neptune features the fastest supersonic winds in the entire Solar System, reaching 2,100 km/h!',
      'Its moon Triton orbits backwards and has active ice volcanoes spraying liquid nitrogen.',
      'It takes Neptune roughly 165 Earth years to complete its long polar orbit around the Sun.'
    ],
    sizeScale: 1.15,
    orbitRadius: 114,
    orbitSpeed: 0.0006,
    rotationSpeed: 0.014,
    tilt: 28.32,
    texturePattern: 'deep_blue',
    hasAtmosphereGlow: true,
    atmosphereColor: '#3B82F6',
    overview: 'Neptune is the absolute outer giant boundary of our planetary system, cold, dark, and whipped by supersonic atmospheric jet streams. This deep-cobalt ice giant sports a dense fluid interior of water complexes.',
    formation: 'Assembled in the outer circumstellar disc alongside Uranus, holding dynamic materials that failed to migrate further.',
    atmosphereComposition: '80% Hydrogen, 19% Helium, 1.5% Methane, with trace hydrocarbon vapors driving high storm lines.',
    surfaceConditions: 'Violent winds tear across white clouds of frozen methane. Extreme convective heat rise drives colossal spinning storms.',
    scientificFacts: [
      'Its internal heat source is unusually active, radiating 2.6 times the thermal energy it receives from the Sun.',
      'Mathematical predictions by Urbain Le Verrier discovered Neptune before it was ever viewed with a telescope in 1846.',
      'Triton\'s backward (retrograde) orbit is proof it was once a free-floating Kuiper Belt dwarf planet captured by Neptune\'s gravity.'
    ],
    layers: [
      {
        name: 'Atmosphere',
        description: 'Churning cobalt atmosphere marked by bright white methane cloud bands and high winds.',
        thickness: '5,000 km',
        temperature: '-218°C',
        composition: 'Hydrogen, helium, methane gases',
        color: '#2760C8',
        radiusRatio: 1.0
      },
      {
        name: 'Ice Mantle',
        description: 'Highly conductive ionic water-ammonium mixture under immense compression and chemical pressure.',
        thickness: '15,000 km',
        temperature: '2,500°C to 5,500°C',
        composition: 'Liquid ionic/superionic water, ammonia, methane',
        color: '#133B7D',
        radiusRatio: 0.8
      },
      {
        name: 'Core',
        description: 'A compact mineral core of solid iron-nickel alloys and rocky silicates under grand gravitational pressures.',
        thickness: '4,600 km',
        temperature: '7,000°C',
        composition: 'Silicates, solid rock, iron, nickel',
        color: '#081736',
        radiusRatio: 0.2
      }
    ]
  }
];

export const SPACE_FACTS: SpaceFact[] = [
  {
    id: 'fact-1',
    category: 'planet',
    categoryLabel: 'Planet Facts',
    title: 'Venusian Retrograde',
    text: 'Venus rotates backwards compared to almost all other planets, meaning the Sun rises in the west and sets in the east.'
  },
  {
    id: 'fact-2',
    category: 'system',
    categoryLabel: 'Solar System',
    title: 'Immense Sun Mass',
    text: 'The Sun accounts for an incredible 99.86% of all matter in the entire Solar System, holding everything together.'
  },
  {
    id: 'fact-3',
    category: 'planet',
    categoryLabel: 'Planet Facts',
    title: 'Short Jupiter Days',
    text: 'Jupiter has the shortest day of all the major planets. It rotates on its axis once every 9.9 hours, churning its gas clouds.'
  },
  {
    id: 'fact-4',
    category: 'planet',
    categoryLabel: 'Planet Facts',
    title: 'Floating Saturn',
    text: 'Saturn has the lowest density of any planet in our solar system. It is less dense than water; if placed in a giant ocean, it would float!'
  },
  {
    id: 'fact-5',
    category: 'mission',
    categoryLabel: 'Space Missions',
    title: 'Voyager Interstellar Journey',
    text: 'Voyager 1 and 2, launched in 1977, have both crossed the heliopause into interstellar space and continue to beam back distant signals.'
  },
  {
    id: 'fact-6',
    category: 'sun',
    categoryLabel: 'Sun Facts',
    title: 'Solar Core Heat',
    text: 'The temperature at the core of the Sun reaches approximately 15 Million °C, driving the nuclear fusion engine.'
  },
  {
    id: 'fact-7',
    category: 'system',
    categoryLabel: 'Solar System',
    title: 'The Oort Cloud Bound',
    text: 'The boundary of the Solar System is not the Pluto orbit, but the hypothetical Oort Cloud, located up to 100,000 astronomical units away.'
  },
  {
    id: 'fact-8',
    category: 'planet',
    categoryLabel: 'Planet Facts',
    title: 'Diamond Rain',
    text: 'Extreme carbon atmospheric pressures inside Ice Giants Uranus and Neptune compress methane gas until it crystallizes into physical diamonds that fall like snow.'
  },
  {
    id: 'fact-9',
    category: 'mission',
    categoryLabel: 'Space Missions',
    title: 'Mars Robot Colony',
    text: 'Mars is currently the only known planet inhabited entirely by operational planetary rovers, autonomous landers, and copters.'
  },
  {
    id: 'fact-10',
    category: 'sun',
    categoryLabel: 'Sun Facts',
    title: 'Light Travel Delays',
    text: 'Photons created in the Sun\'s core take up to 100,000 years to reach its surface, but once free, they travel to Earth in just 8 minutes.'
  },
  {
    id: 'fact-11',
    category: 'planet',
    categoryLabel: 'Planet Facts',
    title: 'Olympus Mons',
    text: 'Mars hosts Olympus Mons, a massive shield volcano three times taller than Mt. Everest with a base spanning the width of entire nations.'
  },
  {
    id: 'fact-12',
    category: 'system',
    categoryLabel: 'Solar System',
    title: 'Asteroid Belt Gap',
    text: 'Despite sci-fi representations, the Asteroid Belt is virtually empty space. If you stood on an asteroid, the next closest would be thousands of kilometers away!'
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // Basics Category
  {
    id: 'q-1',
    question: 'Which celestial body occupies 99.86% of the total mass in our Solar System?',
    options: ['Jupiter', 'The Sun', 'Saturn', 'All gas giants combined'],
    correctIndex: 1,
    category: 'basics',
    difficulty: 'easy',
    explanation: 'The Sun dominates the Solar System, holding nearly all matter in its deep gravitational domain.'
  },
  {
    id: 'q-2',
    question: 'How many planets in our Solar System are categorized as rocky terrestrial worlds?',
    options: ['Two', 'Four', 'Six', 'Eight'],
    correctIndex: 1,
    category: 'basics',
    difficulty: 'easy',
    explanation: 'The first four planets (Mercury, Venus, Earth, Mars) are terrestrial, made primarily of silicate rocks and metals.'
  },
  {
    id: 'q-3',
    question: 'Approximately how long does it take for light from the Sun to reach Earth?',
    options: ['8 seconds', '8 minutes', '8 hours', '8 days'],
    correctIndex: 1,
    category: 'basics',
    difficulty: 'easy',
    explanation: 'Traveling at 300,000 km/s, light covers the 150 million km distance between Earth and the Sun in about 8 minutes.'
  },
  
  // Structures Category
  {
    id: 'q-4',
    question: 'Underneath Jupiter\'s howling high-wind cloud layer, what unique conductive substance generates its massive magnetic field?',
    options: ['Molten Iron-Nickel', 'Superconductive Carbon', 'Liquid Metallic Hydrogen', 'Gaseous Plasma Bands'],
    correctIndex: 2,
    category: 'structures',
    difficulty: 'hard',
    explanation: 'Extreme pressures compress hydrogen into a liquid metal state that conducts electricity, generating a massive magnetic dynamo.'
  },
  {
    id: 'q-5',
    question: 'How many internal layers are scientifically defined for Venus, including its thick outer veil?',
    options: ['Two (Crust & Core)', 'Three (Crust, Mantle, Core)', 'Four (Atmosphere, Crust, Mantle, Core)', 'Five layers'],
    correctIndex: 2,
    category: 'structures',
    difficulty: 'medium',
    explanation: 'Venus is defined by four core cross-sectional layers: Atmosphere, Crust, Mantle, and Core.'
  },
  {
    id: 'q-6',
    question: 'What is the compositions of the mantle of Ice Giants Uranus and Neptune?',
    options: ['Liquid Molten Lava', 'Hot sloshing ionic water-ammonia slush', 'Crystalline iron silicates', 'Molecular hydrogen crystals'],
    correctIndex: 1,
    category: 'structures',
    difficulty: 'hard',
    explanation: 'The mantle of Uranus and Neptune consists of a superheated, highly compressed electrical fluid "soup" of water, ammonia, and methane.'
  },

  // Facts Category
  {
    id: 'q-7',
    question: 'Which of the following planets rotates clockwise (Retrograde) on its axis?',
    options: ['Mars', 'Jupiter', 'Venus', 'Neptune'],
    correctIndex: 2,
    category: 'facts',
    difficulty: 'medium',
    explanation: 'Venus rotates backwards (retrorotation), likely due to a massive collision early in its formation.'
  },
  {
    id: 'q-8',
    question: 'Why is Mars intensely rust-red in visual color?',
    options: ['Methane gas reflection', 'Volcanic lava fields', 'Iron Oxide particles on the surface', 'The Solar radiation refraction'],
    correctIndex: 2,
    category: 'facts',
    difficulty: 'easy',
    explanation: 'Mars\' surface is rich in iron oxides, basically rusty dust, which is kicked into its thin atmosphere.'
  },
  {
    id: 'q-9',
    question: 'Which planet has the shortest day-rotation period in the Solar System?',
    options: ['Earth', 'Mercury', 'Jupiter', 'Saturn'],
    correctIndex: 2,
    category: 'facts',
    difficulty: 'medium',
    explanation: 'Jupiter rotates on its axis once every 9.9 hours, making it the swiftest spinner among planets.'
  },

  // Astronomy Category
  {
    id: 'q-10',
    question: 'The Roche limit describes the mechanical point where a celestial body will...',
    options: ['Be dragged into solar orbits', 'Decompress into gaseous voids', 'Be torn apart by gravitational tidal forces', 'Ignite thermonuclear fusion'],
    correctIndex: 2,
    category: 'astronomy',
    difficulty: 'hard',
    explanation: 'The Roche Limit is the minimum orbital distance inside of which a body held together only by gravity will disintegrate due to tidal forces.'
  },
  {
    id: 'q-11',
    question: 'Which moon of Saturn is known for spraying active liquid water plumes into space?',
    options: ['Titan', 'Enceladus', 'Mimas', 'Dione'],
    correctIndex: 1,
    category: 'astronomy',
    difficulty: 'medium',
    explanation: 'Enceladus has a global ocean under its icy surface and regularly vents water vapor and ice grains into space.'
  },
  {
    id: 'q-12',
    question: 'Neptune\'s orbital duration around the Sun is approximately equal to how many Earth years?',
    options: ['29 Years', '84 Years', '165 Years', '248 Years'],
    correctIndex: 2,
    category: 'astronomy',
    difficulty: 'hard',
    explanation: 'Cruising at the far edge of the classical planet system, Neptune takes about 164.8 Earth years to make a full trip.'
  }
];
