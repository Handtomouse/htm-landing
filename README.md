# HandToMouse Landing Page

Pixel-art hand game animation landing page for www.handtomouse.org

## Features

- ✨ Retro pixel-art hand dodge/fire game animation
- 📧 Email capture for launch notifications
- 🎨 BlackBerry OS5-inspired aesthetic (VT323 font, #FF9D23 orange)
- 📊 Vercel Analytics integration
- 🚀 Ultra-lightweight Next.js 15 build

## Tech Stack

- **Framework:** Next.js 15.5
- **Styling:** Tailwind CSS 4
- **Animations:** Pure CSS keyframes (no JS)
- **Email:** Resend API (optional)
- **Analytics:** Vercel Analytics
- **Hosting:** Vercel

## Local Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Environment Variables

Create `.env.local` file (see `.env.example`):

```bash
RESEND_API_KEY=re_xxxxxxxxxxxxx
NOTIFICATION_EMAIL=hello@handtomouse.org
```

## Animation Versions

- **v1:** Frame-accurate recreation of original GIF
- **v2:** Enhanced with collision flashes, recoil effects, and CRT scanlines

Toggle in development mode with the button in the bottom-right corner.

## Deployment

### Vercel Deployment

1. Push to GitHub
2. Connect repo to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Domain Setup

1. Add `www.handtomouse.org` in Vercel project settings → Domains
2. Follow DNS configuration instructions
3. Wait for SSL certificate (auto-provisioned)

## Domain Migration from Squarespace

See [DOMAIN_MIGRATION.md](./DOMAIN_MIGRATION.md) for detailed instructions on transferring your domain from Squarespace to Vercel.

## File Structure

```
htm-landing/
├── app/
│   ├── api/subscribe/route.ts    # Email subscription endpoint
│   ├── layout.tsx                 # Root layout with VT323 font
│   ├── page.tsx                   # Landing page
│   └── globals.css                # Global styles
├── components/
│   ├── HandGameAnimation.tsx      # Pixel-art hand game
│   └── EmailCaptureForm.tsx       # Email capture form
├── public/
│   ├── hand-sprite-left.svg       # Left pointing hand
│   ├── hand-sprite-right.svg      # Right pointing hand
│   └── favicon.svg                # HTM favicon
└── README.md
```

## Switching to BB-OS Site

When the full BB-OS portfolio site is ready:

1. In Vercel dashboard, remove `www.handtomouse.org` from this project
2. Add `www.handtomouse.org` to the `htm-bb-mode` project
3. DNS automatically updates (instant switch)

## License

© 2024 HandToMouse Studio
