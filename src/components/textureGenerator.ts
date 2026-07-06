/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Procedural texture generators using Canvas 2D API for 3D Three.js textures.
// This allows 100% offline, immediate, premium high-res materials without external CDNs.

export function createCraterTexture(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Base grey
  ctx.fillStyle = '#9C9C9C';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Add random surface noise
  for (let i = 0; i < 20000; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const size = Math.random() * 2 + 1;
    const gray = Math.floor(Math.random() * 40 - 20) + 150;
    ctx.fillStyle = `rgb(${gray}, ${gray}, ${gray})`;
    ctx.fillRect(x, y, size, size);
  }

  // Draw some craters
  for (let i = 0; i < 150; i++) {
    const cx = Math.random() * canvas.width;
    const cy = Math.random() * canvas.height;
    const r = Math.random() * 30 + 5;

    // Outer crater ring (with light-dark 3D shading)
    const grd = ctx.createLinearGradient(cx - r, cy - r, cx + r, cy + r);
    grd.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
    grd.addColorStop(1, 'rgba(0, 0, 0, 0.5)');

    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fillStyle = grd;
    ctx.fill();

    // Inside crater bowl
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.85, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(70, 70, 70, 0.8)';
    ctx.fill();

    // Central peak
    if (r > 15) {
      const pGrd = ctx.createRadialGradient(cx, cy, 0, cx, cy, r * 0.2);
      pGrd.addColorStop(0, 'rgba(255, 255, 255, 0.5)');
      pGrd.addColorStop(1, 'rgba(70, 70, 70, 0)');
      ctx.beginPath();
      ctx.arc(cx, cy, r * 0.2, 0, Math.PI * 2);
      ctx.fillStyle = pGrd;
      ctx.fill();
    }
  }

  return canvas;
}

export function createVenusTexture(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Venus base atmosphere (sulfuric gas colors)
  ctx.fillStyle = '#E59850';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Add warm dynamic swirls
  for (let y = 0; y < canvas.height; y += 4) {
    const wave = Math.sin(y * 0.05) * 40;
    const colorVal = Math.sin(y * 0.02) * 20 + 210; // base light orange
    const orange = Math.floor(colorVal - 40);
    const yellow = Math.floor(colorVal * 0.7);
    
    ctx.fillStyle = `rgb(${colorVal}, ${orange}, ${yellow})`;
    ctx.fillRect(0, y, canvas.width, 4);

    // Draw whispy dust structures
    ctx.fillStyle = 'rgba(120, 60, 10, 0.15)';
    ctx.beginPath();
    ctx.ellipse(
      (canvas.width / 2 + wave + y * 1.5) % canvas.width,
      y,
      Math.random() * 200 + 100,
      12,
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }

  // Soft blur/noise overlays
  for (let i = 0; i < 15; i++) {
    const cx = Math.random() * canvas.width;
    const cy = Math.random() * canvas.height;
    const rx = Math.random() * 300 + 100;
    const ry = Math.random() * 40 + 10;
    const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, rx);
    grd.addColorStop(0, 'rgba(253, 235, 182, 0.25)');
    grd.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, Math.random() * 0.2, 0, Math.PI * 2);
    ctx.fillStyle = grd;
    ctx.fill();
  }

  return canvas;
}

export function createEarthTexture(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Deep Blue Oceans
  ctx.fillStyle = '#0F2C59';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Shallow water shelf outlines
  ctx.fillStyle = '#1D5A8E';

  // Draw some procedural continents (Earth-like shapes)
  // Americas, Africa, Eurasia, Australia, Antarctica
  const continents = [
    { cx: 300, cy: 220, rx: 110, ry: 150 }, // North America
    { cx: 350, cy: 370, rx: 90, ry: 120 },  // South America
    { cx: 520, cy: 260, rx: 110, ry: 110 }, // Africa
    { cx: 620, cy: 160, rx: 220, ry: 110 }, // Eurasia
    { cx: 800, cy: 360, rx: 80, ry: 60 },   // Australia
    { cx: 500, cy: 490, rx: 500, ry: 30 }   // Antarctica (ice)
  ];

  // Draw green and brown vegetation/rock onto continents
  continents.forEach(({ cx, cy, rx, ry }) => {
    // Coast shelf
    ctx.fillStyle = '#105C8A';
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx * 1.15, ry * 1.15, 0, 0, Math.PI * 2);
    ctx.fill();

    // Land base (grassland green)
    ctx.fillStyle = '#2A7B4C';
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();

    // Add mountain/desert patches (brown)
    ctx.fillStyle = '#8B7355';
    for (let i = 0; i < 6; i++) {
      const px = cx + (Math.random() - 0.5) * rx;
      const py = cy + (Math.random() - 0.5) * ry;
      const pr = Math.random() * (rx * 0.4) + 10;
      ctx.beginPath();
      ctx.arc(px, py, pr, 0, Math.PI * 2);
      ctx.fill();
    }

    // Add snowy mountain peaks
    ctx.fillStyle = '#F5F5F5';
    for (let i = 0; i < 3; i++) {
      const px = cx + (Math.random() - 0.5) * (rx * 0.5);
      const py = cy + (Math.random() - 0.5) * (ry * 0.5);
      const pr = Math.random() * (rx * 0.2) + 5;
      ctx.beginPath();
      ctx.arc(px, py, pr, 0, Math.PI * 2);
      ctx.fill();
    }
  });

  // Highlight Antarctica ice sheet in full white
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 480, canvas.width, 32);

  // Northern poles snow cap
  ctx.beginPath();
  ctx.arc(500, 0, 150, 0, Math.PI, false);
  ctx.fill();

  return canvas;
}

export function createCloudsTexture(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Transparent base
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Generate wispy cloud patterns
  ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
  for (let i = 0; i < 60; i++) {
    const cx = Math.random() * canvas.width;
    const cy = Math.random() * (canvas.height * 0.8) + canvas.height * 0.1;
    const rx = Math.random() * 250 + 50;
    const ry = Math.random() * 30 + 5;
    
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, rx);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
    grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.25)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, (Math.random() - 0.5) * 0.15, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
  }

  return canvas;
}

export function createMarsTexture(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Rust-red Mars base
  ctx.fillStyle = '#9C4328';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Add dark markings (syrtis major, acidalia planitia, etc)
  ctx.fillStyle = '#6E2D1A';
  for (let i = 0; i < 30; i++) {
    const cx = Math.random() * canvas.width;
    const cy = Math.random() * canvas.height;
    const rx = Math.random() * 200 + 40;
    const ry = Math.random() * 120 + 20;
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, Math.random() * 0.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // Add bright iron-rich dust patches
  ctx.fillStyle = '#C06D4E';
  for (let i = 0; i < 20; i++) {
    const cx = Math.random() * canvas.width;
    const cy = Math.random() * canvas.height;
    const r = Math.random() * 100 + 30;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Draw bright white CO2 / water ice polar caps
  ctx.fillStyle = '#FAFAFA';
  // South Pole (very distinct)
  ctx.beginPath();
  ctx.arc(canvas.width / 2, canvas.height, 45, Math.PI, 0, false);
  ctx.fill();

  // North pole cap
  ctx.beginPath();
  ctx.arc(canvas.width / 2, 0, 35, 0, Math.PI, false);
  ctx.fill();

  return canvas;
}

export function createJupiterTexture(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Outer gaseous background
  ctx.fillStyle = '#D4B38A';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const bands = [
    { start: 0, end: 60, color: '#9E7E59' },
    { start: 60, end: 100, color: '#D2B48C' },
    { start: 100, end: 140, color: '#B57E4E' },
    { start: 140, end: 190, color: '#E3C19E' },
    { start: 190, end: 240, color: '#A06E40' }, // equatorial reddish belt
    { start: 240, end: 280, color: '#F2DFCB' }, // light zone
    { start: 280, end: 320, color: '#A36F41' },
    { start: 320, end: 380, color: '#DDBFA2' },
    { start: 380, end: 420, color: '#B5804E' },
    { start: 420, end: 512, color: '#8F714E' }
  ];

  bands.forEach(({ start, end, color }) => {
    ctx.fillStyle = color;
    ctx.fillRect(0, start, canvas.width, end - start);

    // Apply turbulence lines inside bands
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    for (let y = start; y < end; y += 4) {
      const amplitude = Math.sin(y * 0.1) * 20;
      ctx.beginPath();
      ctx.moveTo(0, y);
      for (let x = 0; x <= canvas.width; x += 10) {
        ctx.lineTo(x, y + Math.sin(x * 0.03 + amplitude) * 3);
      }
      ctx.lineTo(canvas.width, y + 10);
      ctx.lineTo(0, y + 10);
      ctx.fill();
    }
  });

  // DRAW THE SPECTACULAR DYNAMIC SPINNING GREAT RED SPOT!
  // Jupiter center-right position (typically around -22 degrees latitude)
  const spotX = 700;
  const spotY = 330;
  const spotWidth = 55;
  const spotHeight = 35;

  // Concentric rings for storms
  for (let rScale = 1.0; rScale > 0.1; rScale -= 0.15) {
    const red = Math.floor(180 + (1 - rScale) * 75);
    const green = Math.floor(60 + (1 - rScale) * 20);
    const blue = Math.floor(40 + (1 - rScale) * 10);
    ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;

    ctx.beginPath();
    ctx.ellipse(spotX, spotY, spotWidth * rScale, spotHeight * rScale, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Add surrounding turbulent wisps around GRS
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(spotX, spotY, spotWidth * 1.3, spotHeight * 2.1, 0.04, 0, Math.PI);
  ctx.stroke();

  return canvas;
}

export function createSaturnTexture(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Smooth butterscotch-cream Saturn coloring
  ctx.fillStyle = '#E3CFA2';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Soft low-contrast horizontal bands
  const bands = [
    { start: 0, end: 90, color: '#C6B287' },
    { start: 90, end: 150, color: '#E0CCA1' },
    { start: 150, end: 200, color: '#D5BC8A' },
    { start: 200, end: 260, color: '#ECDDB0' },
    { start: 260, end: 340, color: '#CAAE78' },
    { start: 340, end: 400, color: '#DFCAA0' },
    { start: 400, end: 512, color: '#BCA275' }
  ];

  bands.forEach(({ start, end, color }) => {
    ctx.fillStyle = color;
    ctx.fillRect(0, start, canvas.width, end - start);
  });

  return canvas;
}

export function createSaturnRingsTexture(): HTMLCanvasElement {
  // A narrow 1x512 canvas acting as a concentric rings transparency map
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 1;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Rings range from inner to outer; create custom ice-ring density bands
  for (let x = 0; x < canvas.width; x++) {
    // Generate organic concentric gaps (Cassini gap, Encke gap etc.)
    const distRatio = x / canvas.width;
    let opacity = 0.85;

    if (distRatio < 0.1) opacity = distRatio * 5; // inner fade
    else if (distRatio > 0.9) opacity = (1 - distRatio) * 6; // outer fade
    
    // Cassini division (~ ratio 0.65 to 0.70)
    else if (distRatio > 0.65 && distRatio < 0.71) opacity = 0.05;
    // Encke gap (~ ratio 0.85 to 0.87)
    else if (distRatio > 0.83 && distRatio < 0.86) opacity = 0.1;
    // Crêpe ring region (inner)
    else if (distRatio < 0.25) opacity = 0.3 + distRatio * 0.8;
    // Other randomly generated mini-divisions
    else {
      const noise = Math.sin(x * 0.6) * 0.2 + Math.cos(x * 0.15) * 0.15;
      opacity = 0.65 + noise;
    }

    ctx.fillStyle = `rgba(218, 198, 160, ${Math.max(0, Math.min(1, opacity))})`;
    ctx.fillRect(x, 0, 1, 1);
  }

  return canvas;
}

export function createIceBlueTexture(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Smooth cyan
  ctx.fillStyle = '#BFECFF';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Add subtle turquoise bands (Uranus has highly faint markings)
  for (let y = 0; y < canvas.height; y += 8) {
    const offset = Math.sin(y * 0.01) * 15;
    ctx.fillStyle = `rgb(${191 + offset}, ${236 - offset}, ${255})`;
    ctx.fillRect(0, y, canvas.width, 8);
  }

  return canvas;
}

export function createDeepBlueTexture(): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Royal Cobalt Blue
  ctx.fillStyle = '#21469D';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Add dark swirling storm boundaries
  ctx.fillStyle = '#112260';
  for (let i = 0; i < 8; i++) {
    const cx = Math.random() * canvas.width;
    const cy = Math.random() * canvas.height;
    const rx = Math.random() * 250 + 50;
    const ry = Math.random() * 80 + 10;
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, (Math.random() - 0.5) * 0.25, 0, Math.PI * 2);
    ctx.fill();
  }

  // High altitude wispy clouds (frozen white methane slips)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
  for (let i = 0; i < 15; i++) {
    const cx = Math.random() * canvas.width;
    const cy = Math.random() * canvas.height;
    const rx = Math.random() * 150 + 40;
    const ry = Math.random() * 15 + 35;
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, (Math.random() - 0.5) * 0.1, 0, Math.PI * 2);
    ctx.fill();
  }

  return canvas;
}
