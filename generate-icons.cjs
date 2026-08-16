const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

async function generate() {
  const publicDir = path.join(__dirname, 'public');
  const svgPath = path.join(publicDir, 'logo.svg');
  const svgBuffer = fs.readFileSync(svgPath);

  console.log('Generating favicon and app icons from logo.svg...');

  // 1. Generate PNGs of various sizes with transparent background
  const sizes = [
    { name: 'favicon-16x16.png', size: 16 },
    { name: 'favicon-32x32.png', size: 32 },
    { name: 'favicon-48x48.png', size: 48 },
    { name: 'favicon-96x96.png', size: 96 },
    { name: 'apple-touch-icon.png', size: 180 },
    { name: 'icon-192.png', size: 192 },
    { name: 'icon-512.png', size: 512 },
    { name: 'favicon.png', size: 48 }
  ];

  for (const item of sizes) {
    const outputPath = path.join(publicDir, item.name);
    await sharp(svgBuffer)
      .resize(item.size, item.size, { fit: 'contain', background: { r: 7, g: 13, b: 29, alpha: 1 } })
      .png()
      .toFile(outputPath);
    console.log(`Generated ${item.name} (${item.size}x${item.size})`);
  }

  // 2. Generate standard favicon.ico (using 48x48 png buffer)
  const ico48Buffer = await sharp(svgBuffer)
    .resize(48, 48, { fit: 'contain', background: { r: 7, g: 13, b: 29, alpha: 1 } })
    .png()
    .toBuffer();
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), ico48Buffer);
  console.log('Generated favicon.ico');

  // 3. Generate OG / Social preview image (1200x630)
  const ogSvg = `
  <svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
    <rect width="1200" height="630" fill="#070D1D"/>
    <!-- Glow circles -->
    <circle cx="200" cy="150" r="300" fill="#15803D" opacity="0.15" filter="blur(60px)"/>
    <circle cx="1000" cy="450" r="350" fill="#0284C7" opacity="0.15" filter="blur(60px)"/>
    <g transform="translate(100, 65) scale(0.95)">
      ${fs.readFileSync(svgPath, 'utf8').replace(/<svg[^>]*>|<\/svg>/gi, '')}
    </g>
    <text x="600" y="240" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="52" font-weight="900">Hans Compain (HansAI)</text>
    <text x="600" y="310" fill="#38BDF8" font-family="system-ui, sans-serif" font-size="32" font-weight="700">Digital SSC &amp; Shorthand AI Companion</text>
    <text x="600" y="375" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="24" font-weight="500">Live Quizzes • Mistake Notebook • Steno Studio • Science Lab</text>
    <rect x="600" y="420" width="340" height="50" rx="25" fill="#22C55E" opacity="0.2"/>
    <text x="770" y="452" text-anchor="middle" fill="#4ADE80" font-family="system-ui, sans-serif" font-size="20" font-weight="700">🌐 hans-compain.onrender.com</text>
  </svg>
  `;

  await sharp(Buffer.from(ogSvg))
    .resize(1200, 630)
    .png()
    .toFile(path.join(publicDir, 'og-image.png'));
  console.log('Generated og-image.png');

  console.log('All icons and banners generated successfully!');
}

generate().catch(console.error);
