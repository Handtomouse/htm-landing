# Domain Migration Guide: Squarespace → Vercel

This guide walks you through transferring `www.handtomouse.org` from Squarespace to Vercel.

## Overview

**Current State:**
- Domain: `www.handtomouse.org` (managed by Squarespace)
- Site: Hosted on Squarespace
- Status: Live

**Target State:**
- Domain: `www.handtomouse.org` (managed by Vercel or external registrar)
- Site: Landing page on Vercel (this repo)
- Status: Live with zero downtime

## Option 1: Transfer to Vercel Domains (RECOMMENDED)

**Pros:**
- Simplest process (Vercel handles everything)
- Automatic DNS configuration
- Free domain management
- Integrated with deployments

**Cons:**
- Less flexibility than external registrar
- Tied to Vercel ecosystem

### Steps:

1. **Deploy landing page to Vercel**
   ```bash
   # Push to GitHub
   git init
   git add .
   git commit -m "Initial commit: HandToMouse landing page"
   git remote add origin https://github.com/Handtomouse/htm-landing.git
   git push -u origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import `htm-landing` repo
   - Deploy (takes ~1 minute)
   - Note your preview URL: `htm-landing.vercel.app`

3. **Add custom domain in Vercel**
   - In Vercel project → Settings → Domains
   - Click "Add Domain"
   - Enter: `handtomouse.org` and `www.handtomouse.org`
   - Vercel will detect it's registered with Squarespace

4. **Transfer domain to Vercel**
   - Vercel will show "Transfer Domain" option
   - Follow Vercel's transfer wizard:
     1. Unlock domain in Squarespace
     2. Get authorization code from Squarespace
     3. Enter auth code in Vercel
     4. Confirm transfer
     5. Wait 5-7 days for transfer to complete

5. **During transfer (temporary DNS)**
   - While transfer is in progress, you can update DNS manually:
   - In Squarespace → Settings → Domains → DNS Settings
   - Update A record:
     - Type: A
     - Host: @
     - Value: `76.76.21.21` (Vercel)
   - Update CNAME record:
     - Type: CNAME
     - Host: www
     - Value: `cname.vercel-dns.com.`
   - TTL: 300 (5 minutes)
   - Propagation: 15 minutes to 48 hours (usually <1 hour)

6. **After transfer completes**
   - Vercel automatically configures DNS
   - SSL certificate auto-provisioned
   - Domain fully transferred
   - Cancel Squarespace subscription (if desired)

---

## Option 2: Transfer to External Registrar (Namecheap, Cloudflare, etc.)

**Pros:**
- Full control over domain
- Potentially cheaper
- Can use different registrar features

**Cons:**
- More manual setup
- Need to manage DNS separately

### Steps:

1. **Choose registrar**
   - Namecheap (easiest)
   - Cloudflare (best DNS)
   - Google Domains (simple)
   - Hover, GoDaddy, etc.

2. **Initiate transfer at new registrar**
   - Create account at chosen registrar
   - Go to "Transfer Domain"
   - Enter: `handtomouse.org`
   - Cost: Usually free (1-year renewal included)

3. **Unlock domain in Squarespace**
   - Go to Squarespace → Settings → Domains
   - Select `handtomouse.org`
   - Click "Transfer Out"
   - Unlock domain
   - Get authorization code (EPP code)

4. **Complete transfer at registrar**
   - Enter authorization code
   - Confirm transfer
   - Check email for approval link
   - Approve transfer
   - Wait 5-7 days for completion

5. **Configure DNS (point to Vercel)**
   - In registrar's DNS settings:
   - Add A record:
     - Type: A
     - Host: @ (or root)
     - Value: `76.76.21.21`
     - TTL: 300
   - Add CNAME record:
     - Type: CNAME
     - Host: www
     - Value: `cname.vercel-dns.com.`
     - TTL: 300

6. **Add domain in Vercel**
   - Vercel project → Settings → Domains
   - Add `handtomouse.org` and `www.handtomouse.org`
   - Vercel will verify DNS records
   - SSL certificate auto-provisioned

---

## Minimizing Downtime

### Strategy 1: Deploy before DNS change
1. Deploy landing page to Vercel (get preview URL)
2. Test thoroughly: `htm-landing.vercel.app`
3. Update DNS records (A + CNAME)
4. Wait for propagation
5. Site switches from Squarespace → Vercel

**Downtime:** Usually 0-15 minutes during DNS propagation

### Strategy 2: Low TTL pre-migration
1. 48 hours before migration: Lower DNS TTL to 300 seconds (5 minutes)
2. Wait for old TTL to expire
3. Deploy to Vercel
4. Update DNS
5. Propagation is much faster (5-15 minutes)

**Downtime:** 5-15 minutes

---

## Squarespace Content Export

If you want to preserve specific pages:

1. **Export content**
   - Squarespace → Settings → Advanced → Import/Export
   - Export as WordPress XML (most compatible)
   - Download images/assets separately

2. **Options for preservation:**
   - **Archive locally:** Save files in Git repo or Google Drive
   - **Migrate to Vercel:** Add pages as routes in Next.js
   - **Temporary routes:** Create `/archive/*` routes with old content

3. **Pages to consider migrating:**
   - About page
   - Portfolio/work (if any)
   - Contact info
   - Blog posts (if any)

---

## Checklist

### Pre-Migration
- [ ] Deploy landing page to Vercel
- [ ] Test on preview URL
- [ ] Verify email capture works
- [ ] Check analytics tracking
- [ ] Export Squarespace content (if needed)
- [ ] Lower DNS TTL to 300 seconds (optional but recommended)

### During Migration
- [ ] Unlock domain in Squarespace
- [ ] Get authorization code
- [ ] Initiate transfer (Vercel Domains or external registrar)
- [ ] Update DNS records (temporary, during transfer)
- [ ] Monitor DNS propagation: [whatsmydns.net](https://www.whatsmydns.net)

### Post-Migration
- [ ] Verify site loads at www.handtomouse.org
- [ ] Check SSL certificate (should be automatic)
- [ ] Test email capture form
- [ ] Test on mobile/desktop
- [ ] Verify analytics tracking
- [ ] Cancel Squarespace subscription (when ready)
- [ ] Update social media links (if needed)

---

## Troubleshooting

### "Domain not propagating"
- Wait longer (can take up to 48 hours, usually <1 hour)
- Check DNS with: `dig handtomouse.org`
- Clear browser cache
- Try incognito mode or different browser
- Test with: [whatsmydns.net](https://www.whatsmydns.net)

### "SSL certificate not working"
- Vercel auto-provisions SSL (takes 5-10 minutes)
- If stuck, remove domain and re-add in Vercel
- Verify DNS is pointing to Vercel (A record: 76.76.21.21)

### "Transfer stuck"
- Check email for approval links
- Verify domain is unlocked in Squarespace
- Contact registrar support
- Typical transfer time: 5-7 days (sometimes 1-2 days)

### "Site showing old Squarespace content"
- DNS propagation delay (normal)
- Clear browser cache
- Try different device/network
- Check DNS: `nslookup www.handtomouse.org`

---

## Timeline Estimate

| Step | Duration | Notes |
|------|----------|-------|
| Deploy to Vercel | 5-10 minutes | First-time setup |
| Unlock domain | 2 minutes | In Squarespace settings |
| Initiate transfer | 5 minutes | At Vercel or registrar |
| Transfer waiting | 5-7 days | Varies by registrar |
| DNS propagation | 15 min - 48 hrs | Usually <1 hour with low TTL |
| SSL provision | 5-10 minutes | Automatic by Vercel |

**Total:** 5-7 days (mostly waiting for domain transfer)

**Actual work:** ~30 minutes

---

## Support Resources

- **Vercel Docs:** [vercel.com/docs/domains](https://vercel.com/docs/domains)
- **Squarespace Transfer Guide:** [support.squarespace.com/hc/en-us/articles/206541217](https://support.squarespace.com/hc/en-us/articles/206541217)
- **DNS Propagation Checker:** [whatsmydns.net](https://www.whatsmydns.net)
- **Vercel Support:** [vercel.com/support](https://vercel.com/support)

---

## Questions?

If you get stuck at any step:
1. Check Vercel deployment logs
2. Verify DNS records with `dig` or `nslookup`
3. Contact Vercel support (very responsive)
4. Or reach out to registrar support

---

**Last Updated:** 2024-11-27
**Author:** HandToMouse Studio
