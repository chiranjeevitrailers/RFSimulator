# 🚀 5GLabX Platform - Netlify + Supabase Deployment Guide

## 📋 Prerequisites

Before deploying, ensure you have:

- ✅ Supabase account and project (database already set up)
- ✅ Netlify account
- ✅ GitHub repository (already set up: chiranjeevitrailers/RFSimulator)
- ✅ All fixes applied (QUICK_FIX_V3.sql already run)

---

## 🎯 Deployment Steps

### **Step 1: Supabase Configuration** ✅

Your Supabase database is already configured with:
- ✅ All tables created
- ✅ RLS policies fixed
- ✅ Realtime enabled
- ✅ System user created (or NULL user_id support)

**No additional Supabase setup needed!** 🎉

---

### **Step 2: Deploy to Netlify**

#### **Option A: Deploy via Netlify Dashboard (Recommended)**

1. **Go to Netlify Dashboard**
   - Visit: https://app.netlify.com
   - Click **"Add new site"** → **"Import an existing project"**

2. **Connect GitHub Repository**
   - Choose **GitHub**
   - Select repository: **chiranjeevitrailers/RFSimulator**
   - Choose branch: **main**

3. **Configure Build Settings**
   - **Build command:** `npm run build`
   - **Publish directory:** `.next`
   - **Base directory:** (leave empty)

4. **Add Environment Variables**
   Click **"Show advanced"** → **"New variable"**
   
   Add these 3 variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
   SUPABASE_SERVICE_ROLE_KEY=eyJxxx...
   ```
   
   ⚠️ **Get these from:**
   - Supabase Dashboard → Settings → API
   - Copy: Project URL, anon public key, service_role key

5. **Deploy**
   - Click **"Deploy site"**
   - Wait 3-5 minutes for build
   - Your site will be live at: `https://random-name-12345.netlify.app`

---

#### **Option B: Deploy via Netlify CLI**

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize site
netlify init

# Set environment variables
netlify env:set NEXT_PUBLIC_SUPABASE_URL "https://xxxxx.supabase.co"
netlify env:set NEXT_PUBLIC_SUPABASE_ANON_KEY "eyJxxx..."
netlify env:set SUPABASE_SERVICE_ROLE_KEY "eyJxxx..."

# Deploy
netlify deploy --prod
```

---

### **Step 3: Verify Deployment**

After deployment completes:

1. **Visit your Netlify URL**
   ```
   https://your-site-name.netlify.app
   ```

2. **Test the flow:**
   - Go to `/user-dashboard`
   - Click "Test Manager" tab
   - Execute a test case
   - Switch to "5GLabX Platform" → "Logs Viewer"
   - ✅ Should see real-time data!

3. **Check browser console (F12):**
   ```
   📡 Supabase Realtime subscription status: SUBSCRIBED
   ✅ LogsView: Added real-time message to logs
   ```

---

## 🔧 Environment Variables Reference

Your `.env.local` file should have these (for local development):

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...

# Optional: Add custom domain later
NEXT_PUBLIC_APP_URL=https://your-custom-domain.com
```

**For Netlify:**
- Set the SAME variables in Netlify Dashboard
- Navigate to: Site settings → Environment variables → Add variable

---

## 🎨 Custom Domain (Optional)

### Add Your Own Domain:

1. **In Netlify Dashboard:**
   - Go to: Domain settings → Add custom domain
   - Enter your domain (e.g., `5glabx.yourcompany.com`)

2. **Update DNS:**
   - Add CNAME record pointing to: `your-site.netlify.app`
   - Or use Netlify DNS (easier)

3. **Enable HTTPS:**
   - Netlify provides free SSL automatically
   - Wait 24 hours for DNS propagation

---

## 🔒 Security Checklist

Before going live, verify:

- ✅ **Environment variables** set in Netlify (not hardcoded)
- ✅ **Supabase RLS** policies enabled
- ✅ **API keys** are using anon key (not service role) in frontend
- ✅ **Service role key** only used in backend API routes
- ✅ **HTTPS** enabled (automatic with Netlify)
- ✅ **No sensitive data** in client-side code

---

## 📊 Monitoring & Analytics

### Netlify Analytics:
- Go to: Netlify Dashboard → Analytics
- Enable Netlify Analytics (paid feature)

### Supabase Analytics:
- Go to: Supabase Dashboard → Database → Observability
- Monitor query performance
- Check Realtime connections

### Application Logs:
- Netlify Functions logs: Dashboard → Functions
- Supabase logs: Dashboard → Logs
- Browser console: F12 → Console

---

## 🐛 Troubleshooting Deployment

### Issue: Build fails with TypeScript errors

**Solution:**
```bash
# Locally test the build
npm run build

# Fix any TypeScript errors
npm run type-check
```

### Issue: Environment variables not working

**Solution:**
1. Check spelling in Netlify Dashboard
2. Remove quotes around values
3. Redeploy after changing env vars
4. Clear deploy cache: Site settings → Build & deploy → Clear cache

### Issue: Data not showing in production

**Solution:**
1. Check browser console for errors
2. Verify Supabase URL is correct
3. Check CORS settings in Supabase
4. Verify API keys are correct
5. Check Realtime is enabled in Supabase project settings

### Issue: "Failed to create test execution" in production

**Solution:**
1. Verify `SUPABASE_SERVICE_ROLE_KEY` is set in Netlify
2. Check RLS policies in Supabase (run QUICK_FIX_V3.sql again if needed)
3. Verify user_id is nullable or NULL

---

## 🚀 Continuous Deployment

Your repository is now set up for automatic deployment:

```
1. Push to GitHub main branch
   ↓
2. Netlify detects changes
   ↓
3. Builds automatically
   ↓
4. Deploys to production
   ↓
5. Live in 3-5 minutes! 🎉
```

To push updates:
```bash
git add .
git commit -m "Your changes"
git push origin main
```

Netlify will automatically deploy! ✨

---

## 📝 Post-Deployment Checklist

After successful deployment:

- [ ] Site is accessible at Netlify URL
- [ ] User dashboard loads correctly
- [ ] Test Manager shows test cases
- [ ] Can execute test cases
- [ ] Data appears in Logs Viewer
- [ ] Realtime updates working
- [ ] No console errors
- [ ] All pages load correctly
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active

---

## 🎉 Success Indicators

Your deployment is successful when:

✅ **Build Status:** ✅ Published  
✅ **Site Status:** Active  
✅ **Functions:** Deployed  
✅ **Environment Variables:** 3/3 set  
✅ **Test Execution:** Working  
✅ **Realtime Data:** Flowing  

---

## 📞 Support Resources

- **Netlify Status:** https://www.netlifystatus.com/
- **Netlify Docs:** https://docs.netlify.com/
- **Supabase Status:** https://status.supabase.com/
- **Supabase Docs:** https://supabase.com/docs

---

## 🔄 Rollback (If Needed)

If deployment has issues:

1. **In Netlify Dashboard:**
   - Go to: Deploys
   - Find previous working deploy
   - Click **"Publish deploy"**

2. **Or revert in GitHub:**
   ```bash
   git revert HEAD
   git push origin main
   ```

---

## 🎯 Quick Deploy Commands

```bash
# Build locally to test
npm run build

# Deploy to Netlify (after netlify init)
netlify deploy --prod

# View deployment logs
netlify open:admin

# Check build status
netlify status
```

---

**Your 5GLabX platform is ready for production! 🚀**

**Next:** Deploy and share your live URL!
