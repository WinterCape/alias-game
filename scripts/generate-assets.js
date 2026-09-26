const sharp = require('sharp');
const path = require('path');

const ASSETS_DIR = path.join(__dirname, '..', 'assets');

async function generateIcon() {
  const size = 1024;
  const svg = `
  <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#161230"/>
        <stop offset="100%" style="stop-color:#0D0A1A"/>
      </linearGradient>
      <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#F0C75E"/>
        <stop offset="50%" style="stop-color:#D4A853"/>
        <stop offset="100%" style="stop-color:#8B6914"/>
      </linearGradient>
      <linearGradient id="cardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:#F5E6C8"/>
        <stop offset="100%" style="stop-color:#DDD0B0"/>
      </linearGradient>
    </defs>
    <rect width="${size}" height="${size}" rx="220" fill="url(#bg)"/>
    <!-- Card shape -->
    <rect x="220" y="160" width="584" height="704" rx="32" fill="url(#cardGrad)"
          stroke="#C4B48A" stroke-width="3"/>
    <!-- Corner ornaments -->
    <path d="M260 200 L320 200 L320 210 L270 210 L270 260 L260 260 Z" fill="#8B6914" opacity="0.5"/>
    <path d="M764 200 L704 200 L704 210 L754 210 L754 260 L764 260 Z" fill="#8B6914" opacity="0.5"/>
    <path d="M260 824 L320 824 L320 814 L270 814 L270 764 L260 764 Z" fill="#8B6914" opacity="0.5"/>
    <path d="M764 824 L704 824 L704 814 L754 814 L754 764 L764 764 Z" fill="#8B6914" opacity="0.5"/>
    <!-- Decorative line top -->
    <line x1="300" y1="280" x2="724" y2="280" stroke="#8B6914" stroke-width="1.5" opacity="0.4"/>
    <!-- Decorative line bottom -->
    <line x1="300" y1="744" x2="724" y2="744" stroke="#8B6914" stroke-width="1.5" opacity="0.4"/>
    <!-- Letter A -->
    <text x="512" y="560" font-family="Georgia, serif" font-size="340"
          font-weight="900" fill="#2C1810" text-anchor="middle" opacity="0.9">A</text>
    <!-- Small sword cross icon below -->
    <line x1="492" y1="620" x2="532" y2="620" stroke="#8B6914" stroke-width="3" opacity="0.5"/>
    <line x1="512" y1="600" x2="512" y2="680" stroke="#8B6914" stroke-width="3" opacity="0.5"/>
    <!-- Gold glow behind card -->
    <rect x="210" y="150" width="604" height="724" rx="36" fill="none"
          stroke="#D4A853" stroke-width="1" opacity="0.3"/>
  </svg>`;

  await sharp(Buffer.from(svg)).resize(1024, 1024).png().toFile(path.join(ASSETS_DIR, 'icon.png'));
  console.log('Generated icon.png');
}

async function generateAdaptiveIconForeground() {
  const size = 1024;
  const svg = `
  <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="cardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:#F5E6C8"/>
        <stop offset="100%" style="stop-color:#DDD0B0"/>
      </linearGradient>
    </defs>
    <rect x="260" y="200" width="504" height="624" rx="28" fill="url(#cardGrad)"
          stroke="#C4B48A" stroke-width="3"/>
    <path d="M296 240 L340 240 L340 248 L304 248 L304 284 L296 284 Z" fill="#8B6914" opacity="0.5"/>
    <path d="M728 240 L684 240 L684 248 L720 248 L720 284 L728 284 Z" fill="#8B6914" opacity="0.5"/>
    <path d="M296 784 L340 784 L340 776 L304 776 L304 740 L296 740 Z" fill="#8B6914" opacity="0.5"/>
    <path d="M728 784 L684 784 L684 776 L720 776 L720 740 L728 740 Z" fill="#8B6914" opacity="0.5"/>
    <text x="512" y="540" font-family="Georgia, serif" font-size="280"
          font-weight="900" fill="#2C1810" text-anchor="middle" opacity="0.9">A</text>
    <line x1="350" y1="310" x2="674" y2="310" stroke="#8B6914" stroke-width="1.5" opacity="0.35"/>
    <line x1="350" y1="714" x2="674" y2="714" stroke="#8B6914" stroke-width="1.5" opacity="0.35"/>
  </svg>`;

  await sharp(Buffer.from(svg)).resize(1024, 1024).png().toFile(path.join(ASSETS_DIR, 'android-icon-foreground.png'));
  console.log('Generated android-icon-foreground.png');
}

async function generateAdaptiveIconBackground() {
  const size = 1024;
  const svg = `
  <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#161230"/>
        <stop offset="100%" style="stop-color:#0D0A1A"/>
      </linearGradient>
    </defs>
    <rect width="${size}" height="${size}" fill="url(#bg)"/>
  </svg>`;

  await sharp(Buffer.from(svg)).resize(1024, 1024).png().toFile(path.join(ASSETS_DIR, 'android-icon-background.png'));
  console.log('Generated android-icon-background.png');
}

async function generateMonochromeIcon() {
  const size = 1024;
  const svg = `
  <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
    <rect x="260" y="200" width="504" height="624" rx="28" fill="none" stroke="white" stroke-width="4"/>
    <text x="512" y="540" font-family="Georgia, serif" font-size="280"
          font-weight="900" fill="white" text-anchor="middle">A</text>
  </svg>`;

  await sharp(Buffer.from(svg)).resize(1024, 1024).png().toFile(path.join(ASSETS_DIR, 'android-icon-monochrome.png'));
  console.log('Generated android-icon-monochrome.png');
}

async function generateSplashIcon() {
  const svg = `
  <svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="cardGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style="stop-color:#F5E6C8"/>
        <stop offset="100%" style="stop-color:#DDD0B0"/>
      </linearGradient>
    </defs>
    <rect x="156" y="40" width="200" height="260" rx="14" fill="url(#cardGrad)"
          stroke="#C4B48A" stroke-width="2"/>
    <text x="256" y="200" font-family="Georgia, serif" font-size="140"
          font-weight="900" fill="#2C1810" text-anchor="middle" opacity="0.9">A</text>
    <text x="256" y="370" font-family="Georgia, serif" font-size="48"
          font-weight="700" fill="#D4A853" text-anchor="middle" letter-spacing="8">ALIAS</text>
    <text x="256" y="410" font-family="Arial, sans-serif" font-size="20"
          font-weight="600" fill="#A89B80" text-anchor="middle" letter-spacing="8">QUEST</text>
    <line x1="180" y1="440" x2="332" y2="440" stroke="#8B6914" stroke-width="1" opacity="0.4"/>
  </svg>`;

  await sharp(Buffer.from(svg)).resize(512, 512).png().toFile(path.join(ASSETS_DIR, 'splash-icon.png'));
  console.log('Generated splash-icon.png');
}

async function generateFavicon() {
  const svg = `
  <svg width="48" height="48" xmlns="http://www.w3.org/2000/svg">
    <rect width="48" height="48" rx="10" fill="#161230"/>
    <rect x="10" y="6" width="28" height="36" rx="4" fill="#F2E4C9" stroke="#C4B48A" stroke-width="1"/>
    <text x="24" y="32" font-family="Georgia, serif" font-size="24"
          font-weight="900" fill="#2C1810" text-anchor="middle">A</text>
  </svg>`;

  await sharp(Buffer.from(svg)).resize(48, 48).png().toFile(path.join(ASSETS_DIR, 'favicon.png'));
  console.log('Generated favicon.png');
}

async function main() {
  await Promise.all([
    generateIcon(),
    generateAdaptiveIconForeground(),
    generateAdaptiveIconBackground(),
    generateMonochromeIcon(),
    generateSplashIcon(),
    generateFavicon(),
  ]);
  console.log('\nAll RPG assets generated!');
}

main().catch(console.error);
