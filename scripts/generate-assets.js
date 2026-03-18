const sharp = require('sharp');
const path = require('path');

const ASSETS_DIR = path.join(__dirname, '..', 'assets');

// App icon - letter "A" on purple gradient background
async function generateIcon() {
  const size = 1024;
  const svg = `
  <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#6C63FF"/>
        <stop offset="100%" style="stop-color:#302B63"/>
      </linearGradient>
      <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#FFFFFF"/>
        <stop offset="100%" style="stop-color:#E0DEFF"/>
      </linearGradient>
    </defs>
    <rect width="${size}" height="${size}" rx="220" fill="url(#bg)"/>
    <!-- Speech bubble shape -->
    <ellipse cx="512" cy="420" rx="340" ry="280" fill="rgba(255,255,255,0.12)"/>
    <polygon points="380,660 460,540 540,620" fill="rgba(255,255,255,0.12)"/>
    <!-- Letter A -->
    <text x="512" y="520" font-family="Arial, Helvetica, sans-serif" font-size="480"
          font-weight="900" fill="url(#textGrad)" text-anchor="middle"
          letter-spacing="-10">A</text>
    <!-- Small Romanian flag accent -->
    <rect x="680" y="180" width="30" height="80" rx="4" fill="#002B7F"/>
    <rect x="710" y="180" width="30" height="80" rx="4" fill="#FCD116"/>
    <rect x="740" y="180" width="30" height="80" rx="4" fill="#CE1126"/>
  </svg>`;

  await sharp(Buffer.from(svg))
    .resize(1024, 1024)
    .png()
    .toFile(path.join(ASSETS_DIR, 'icon.png'));

  console.log('Generated icon.png (1024x1024)');
}

// Adaptive icon foreground (Android)
async function generateAdaptiveIconForeground() {
  const size = 1024;
  const svg = `
  <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#FFFFFF"/>
        <stop offset="100%" style="stop-color:#E0DEFF"/>
      </linearGradient>
    </defs>
    <!-- Speech bubble -->
    <ellipse cx="512" cy="420" rx="280" ry="230" fill="rgba(255,255,255,0.15)"/>
    <polygon points="400,620 460,510 520,590" fill="rgba(255,255,255,0.15)"/>
    <!-- Letter A -->
    <text x="512" y="500" font-family="Arial, Helvetica, sans-serif" font-size="400"
          font-weight="900" fill="url(#textGrad)" text-anchor="middle">A</text>
    <!-- Flag -->
    <rect x="660" y="220" width="24" height="64" rx="3" fill="#002B7F"/>
    <rect x="684" y="220" width="24" height="64" rx="3" fill="#FCD116"/>
    <rect x="708" y="220" width="24" height="64" rx="3" fill="#CE1126"/>
  </svg>`;

  await sharp(Buffer.from(svg))
    .resize(1024, 1024)
    .png()
    .toFile(path.join(ASSETS_DIR, 'android-icon-foreground.png'));

  console.log('Generated android-icon-foreground.png');
}

// Adaptive icon background (Android)
async function generateAdaptiveIconBackground() {
  const size = 1024;
  const svg = `
  <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#6C63FF"/>
        <stop offset="100%" style="stop-color:#302B63"/>
      </linearGradient>
    </defs>
    <rect width="${size}" height="${size}" fill="url(#bg)"/>
  </svg>`;

  await sharp(Buffer.from(svg))
    .resize(1024, 1024)
    .png()
    .toFile(path.join(ASSETS_DIR, 'android-icon-background.png'));

  console.log('Generated android-icon-background.png');
}

// Monochrome icon (Android 13+)
async function generateMonochromeIcon() {
  const size = 1024;
  const svg = `
  <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="512" cy="420" rx="280" ry="230" fill="rgba(255,255,255,0.3)"/>
    <polygon points="400,620 460,510 520,590" fill="rgba(255,255,255,0.3)"/>
    <text x="512" y="500" font-family="Arial, Helvetica, sans-serif" font-size="400"
          font-weight="900" fill="white" text-anchor="middle">A</text>
  </svg>`;

  await sharp(Buffer.from(svg))
    .resize(1024, 1024)
    .png()
    .toFile(path.join(ASSETS_DIR, 'android-icon-monochrome.png'));

  console.log('Generated android-icon-monochrome.png');
}

// Splash screen icon
async function generateSplashIcon() {
  const w = 512;
  const h = 512;
  const svg = `
  <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="textGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#6C63FF"/>
        <stop offset="100%" style="stop-color:#9B93FF"/>
      </linearGradient>
    </defs>
    <!-- Speech bubble -->
    <ellipse cx="256" cy="200" rx="180" ry="140" fill="rgba(108,99,255,0.15)"/>
    <polygon points="200,320 240,260 290,300" fill="rgba(108,99,255,0.15)"/>
    <!-- Letter A -->
    <text x="256" y="260" font-family="Arial, Helvetica, sans-serif" font-size="260"
          font-weight="900" fill="url(#textGrad)" text-anchor="middle">A</text>
    <!-- ALIAS text -->
    <text x="256" y="400" font-family="Arial, Helvetica, sans-serif" font-size="64"
          font-weight="800" fill="#6C63FF" text-anchor="middle" letter-spacing="16">ALIAS</text>
    <!-- Subtitle -->
    <text x="256" y="450" font-family="Arial, Helvetica, sans-serif" font-size="22"
          font-weight="600" fill="#B8B5D0" text-anchor="middle" letter-spacing="4">JOCUL CUVINTELOR</text>
    <!-- Flag -->
    <rect x="210" y="470" width="28" height="14" rx="2" fill="#002B7F"/>
    <rect x="238" y="470" width="28" height="14" rx="2" fill="#FCD116"/>
    <rect x="266" y="470" width="28" height="14" rx="2" fill="#CE1126"/>
  </svg>`;

  await sharp(Buffer.from(svg))
    .resize(512, 512)
    .png()
    .toFile(path.join(ASSETS_DIR, 'splash-icon.png'));

  console.log('Generated splash-icon.png');
}

// Favicon
async function generateFavicon() {
  const size = 48;
  const svg = `
  <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#6C63FF"/>
        <stop offset="100%" style="stop-color:#302B63"/>
      </linearGradient>
    </defs>
    <rect width="${size}" height="${size}" rx="10" fill="url(#bg)"/>
    <text x="24" y="36" font-family="Arial, sans-serif" font-size="32"
          font-weight="900" fill="white" text-anchor="middle">A</text>
  </svg>`;

  await sharp(Buffer.from(svg))
    .resize(48, 48)
    .png()
    .toFile(path.join(ASSETS_DIR, 'favicon.png'));

  console.log('Generated favicon.png');
}

async function main() {
  try {
    await Promise.all([
      generateIcon(),
      generateAdaptiveIconForeground(),
      generateAdaptiveIconBackground(),
      generateMonochromeIcon(),
      generateSplashIcon(),
      generateFavicon(),
    ]);
    console.log('\nAll assets generated successfully!');
  } catch (err) {
    console.error('Error generating assets:', err);
    process.exit(1);
  }
}

main();
