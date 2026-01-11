const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const WIDTH = 1200;
const HEIGHT = 630;

// Brand colors
const BG_COLOR = '#0b0b0b';
const GRID_COLOR = 'rgba(255,255,255,0.03)';

async function generateOgImage() {
  // Read the wordmark SVG
  const svgPath = path.join(__dirname, '../public/HTM-LOGOS-FULLWORDMARK.svg');
  let svgContent = fs.readFileSync(svgPath, 'utf8');

  // Get original dimensions from viewBox
  const viewBoxMatch = svgContent.match(/viewBox="([^"]+)"/);
  const viewBox = viewBoxMatch ? viewBoxMatch[1].split(' ').map(Number) : [0, 0, 816.6, 81.3];
  const originalWidth = viewBox[2];
  const originalHeight = viewBox[3];

  // Scale to fit nicely in OG image (about 60% of width)
  const targetWidth = WIDTH * 0.65;
  const scale = targetWidth / originalWidth;
  const scaledHeight = originalHeight * scale;

  // Update SVG dimensions
  svgContent = svgContent.replace(
    /<svg([^>]*)>/,
    `<svg$1 width="${Math.round(targetWidth)}" height="${Math.round(scaledHeight)}">`
  );

  // Create background with grid pattern
  const gridSize = 40;
  let gridLines = '';
  for (let x = 0; x <= WIDTH; x += gridSize) {
    gridLines += `<line x1="${x}" y1="0" x2="${x}" y2="${HEIGHT}" stroke="${GRID_COLOR}" stroke-width="1"/>`;
  }
  for (let y = 0; y <= HEIGHT; y += gridSize) {
    gridLines += `<line x1="0" y1="${y}" x2="${WIDTH}" y2="${y}" stroke="${GRID_COLOR}" stroke-width="1"/>`;
  }

  // Calculate positions
  const logoX = (WIDTH - targetWidth) / 2;
  const logoY = HEIGHT * 0.35;

  // Tagline and domain
  const tagline = 'Independent creative direction and cultural strategy';
  const domain = 'handtomouse.org';

  // Create the composite SVG
  const compositeSvg = `
    <svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${WIDTH}" height="${HEIGHT}" fill="${BG_COLOR}"/>
      <g opacity="0.4">${gridLines}</g>

      <!-- Wordmark Logo -->
      <g transform="translate(${logoX}, ${logoY})">
        ${svgContent.replace(/<\?xml[^>]*\?>/, '').replace(/<svg[^>]*>/, '').replace(/<\/svg>/, '')}
      </g>

      <!-- Tagline -->
      <text x="${WIDTH / 2}" y="${logoY + scaledHeight + 60}"
            font-family="ui-monospace, 'Courier New', monospace"
            font-size="20"
            fill="rgba(255,255,255,0.7)"
            text-anchor="middle"
            letter-spacing="0.02em">
        ${tagline}
      </text>

      <!-- Domain -->
      <text x="${WIDTH / 2}" y="${HEIGHT - 50}"
            font-family="ui-monospace, 'Courier New', monospace"
            font-size="24"
            fill="rgba(255,255,255,0.4)"
            text-anchor="middle"
            letter-spacing="0.05em">
        ${domain}
      </text>
    </svg>
  `;

  // Convert to PNG
  const outputPath = path.join(__dirname, '../public/og-image.png');

  await sharp(Buffer.from(compositeSvg))
    .png()
    .toFile(outputPath);

  console.log(`OG image generated: ${outputPath}`);
  console.log(`Dimensions: ${WIDTH}x${HEIGHT}`);
}

generateOgImage().catch(console.error);
