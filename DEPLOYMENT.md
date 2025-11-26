# Deployment Guide: HandToMouse Landing Page

## Quick Start

Your landing page is ready to deploy! Here's how to get it live.

## Step 1: Push to GitHub

```bash
# Create a new repo on GitHub: https://github.com/new
# Name it: htm-landing
# Don't initialize with README (we already have one)

# Then run:
cd /Users/handtomouse/Documents/GitHub/htm-landing
git remote add origin https://github.com/Handtomouse/htm-landing.git
git push -u origin main
```

## Step 2: Deploy to Vercel

### Option A: Vercel CLI (Fastest)

```bash
# Install Vercel CLI globally (if not already installed)
npm i -g vercel

# Deploy
vercel

# Follow prompts:
# - Link to existing project? No
# - What's your project's name? htm-landing
# - In which directory is your code located? ./
# - Want to modify settings? No

# Deploy to production
vercel --prod
```

### Option B: Vercel Dashboard (Easier)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import Project"
3. Import from GitHub: `Handtomouse/htm-landing`
4. Configure project:
   - Framework Preset: Next.js (auto-detected)
   - Root Directory: ./
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
5. Click "Deploy"

**Your site will be live at:** `htm-landing.vercel.app`

## Step 3: Add Environment Variables (Optional)

If you want email notifications to work:

1. Get a Resend API key: [resend.com](https://resend.com)
2. In Vercel dashboard → Project Settings → Environment Variables
3. Add:
   - `RESEND_API_KEY`: `re_xxxxxxxxxxxxx`
   - `NOTIFICATION_EMAIL`: `hello@handtomouse.org`
4. Redeploy (Vercel does this automatically)

**Without these:** Emails will still be captured but only logged to console.

## Step 4: Add Custom Domain

### Method 1: Transfer Domain to Vercel (Recommended)

1. In Vercel dashboard → Project Settings → Domains
2. Click "Add Domain"
3. Enter: `www.handtomouse.org`
4. Click "Transfer Domain" (if Vercel detects it's on Squarespace)
5. Follow transfer wizard (see `DOMAIN_MIGRATION.md` for details)

### Method 2: Update DNS Only (Keep Squarespace Registration)

1. In Squarespace → Settings → Domains → DNS Settings
2. Update records:
   - **A Record:**
     - Type: A
     - Host: @
     - Value: `76.76.21.21`
     - TTL: 300
   - **CNAME Record:**
     - Type: CNAME
     - Host: www
     - Value: `cname.vercel-dns.com.`
     - TTL: 300
3. In Vercel → Project Settings → Domains
4. Add `www.handtomouse.org` and `handtomouse.org`
5. Vercel will verify DNS (takes 5-60 minutes)

## Step 5: Verify Deployment

Test checklist:

- [ ] Visit: `htm-landing.vercel.app` (or your custom domain)
- [ ] Hand animation plays smoothly
- [ ] V1/V2 toggle works (dev mode only)
- [ ] Email form accepts input
- [ ] Email form shows success message
- [ ] Mobile responsive (test on phone)
- [ ] SSL certificate active (🔒 in browser)
- [ ] Vercel Analytics working (check dashboard after 24 hours)

## Monitoring

- **Analytics:** Vercel Dashboard → Analytics
- **Logs:** Vercel Dashboard → Deployments → [Latest] → Function Logs
- **Email signups:** Check logs or your notification email

## Switching to BB-OS Site

When the full BB-OS portfolio is ready:

1. **In Vercel:**
   - Go to `htm-landing` project → Settings → Domains
   - Remove `www.handtomouse.org`
   - Go to `htm-bb-mode` project → Settings → Domains
   - Add `www.handtomouse.org`

2. **DNS updates automatically** (if using Vercel Domains)

3. **Test BB-OS site** before switching

**Rollback:** Reverse the steps above if needed

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Verify all dependencies in `package.json`
- Test locally: `npm run build`

### Domain Not Working
- Wait 15-60 minutes for DNS propagation
- Check DNS: `dig www.handtomouse.org`
- Verify A record points to `76.76.21.21`
- Clear browser cache

### Email Form Not Working
- Check function logs in Vercel
- Verify `RESEND_API_KEY` is set (if using Resend)
- Test API endpoint: `curl -X POST https://htm-landing.vercel.app/api/subscribe -d '{"email":"test@example.com"}'`

### Animation Laggy
- Test on different browser
- Check CSS keyframes in HandGameAnimation.tsx
- Reduce animation complexity (switch to v1 instead of v2)

## Next Steps

After deployment:

1. Share preview link with testers
2. Monitor analytics for first few days
3. Collect email signups
4. Continue BB-OS development
5. Switch domains when BB-OS ready

## Resources

- **Vercel Docs:** [vercel.com/docs](https://vercel.com/docs)
- **Next.js Deployment:** [nextjs.org/docs/deployment](https://nextjs.org/docs/deployment)
- **Domain Migration Guide:** See `DOMAIN_MIGRATION.md`
- **Vercel Support:** [vercel.com/support](https://vercel.com/support)

---

**Current Status:**
- ✅ Landing page built
- ✅ Tested locally (http://localhost:3001)
- ✅ Production build successful
- ⏳ Ready to deploy to Vercel
- ⏳ Ready for domain migration

**Last Updated:** 2024-11-27
