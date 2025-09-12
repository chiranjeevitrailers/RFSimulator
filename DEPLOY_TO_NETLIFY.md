# 5GLabX Platform - Netlify Deployment Guide

## Prerequisites

1. **Netlify Account**: Create a free account at [netlify.com](https://netlify.com)
2. **Netlify CLI**: Install globally with `npm install -g netlify-cli`
3. **Git Repository**: Ensure your code is pushed to GitHub

## Quick Deployment Steps

### 1. Login to Netlify
```bash
netlify login
```
This will open your browser for authentication.

### 2. Initialize Netlify Site
```bash
netlify init
```
- Choose "Create & configure a new site"
- Select your team
- Choose a site name (e.g., `5glabx-platform`)
- Set build command: `pnpm build`
- Set publish directory: `out`

### 3. Deploy to Netlify
```bash
netlify deploy --prod
```

## Alternative: Manual Deployment via Netlify Dashboard

### 1. Build the Project
```bash
pnpm install
pnpm build
```

### 2. Deploy via Netlify Dashboard
1. Go to [app.netlify.com](https://app.netlify.com)
2. Click "New site from Git"
3. Connect your GitHub repository
4. Configure build settings:
   - **Build command**: `pnpm build`
   - **Publish directory**: `out`
   - **Node version**: `18`

### 3. Environment Variables
Add these environment variables in Netlify dashboard:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_API_URL=https://your-site.netlify.app
```

## Automated Deployment Script

Create and run this script for automated deployment:

```bash
#!/bin/bash
# deploy.sh

echo "🚀 Starting 5GLabX Platform Deployment..."

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "❌ Netlify CLI not found. Installing..."
    npm install -g netlify-cli
fi

# Check if logged in
if ! netlify status &> /dev/null; then
    echo "🔐 Please login to Netlify first:"
    netlify login
fi

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Build the project
echo "🔨 Building project..."
pnpm build

# Deploy to Netlify
echo "🚀 Deploying to Netlify..."
netlify deploy --prod

echo "✅ Deployment complete!"
echo "🌐 Your site is live at: https://your-site-name.netlify.app"
```

## Post-Deployment Configuration

### 1. Custom Domain (Optional)
- Go to Site settings > Domain management
- Add your custom domain
- Configure DNS records

### 2. Environment Variables
Set up production environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_API_URL`

### 3. Form Handling
Configure form submissions in Netlify dashboard:
- Go to Forms section
- Set up email notifications

## Testing the Deployment

### 1. Homepage
- Visit your deployed URL
- Verify homepage loads correctly
- Test navigation

### 2. Authentication
- Test user signup/login
- Test admin login
- Verify redirects work

### 3. User Dashboard
- Login as user
- Test test case execution
- Verify real-time updates

### 4. Admin Dashboard
- Login as admin
- Test user management
- Verify analytics

## Troubleshooting

### Build Failures
- Check Node.js version (should be 18+)
- Verify all dependencies are installed
- Check for TypeScript errors

### Runtime Errors
- Check browser console for errors
- Verify environment variables are set
- Check Supabase connection

### Performance Issues
- Enable Netlify's CDN
- Optimize images
- Check bundle size

## Monitoring

### 1. Netlify Analytics
- Enable in Site settings
- Monitor page views and performance

### 2. Error Tracking
- Check Netlify Functions logs
- Monitor build logs

### 3. Performance
- Use Netlify's Lighthouse integration
- Monitor Core Web Vitals

## Security

### 1. Headers
The `netlify.toml` includes security headers:
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection
- Content Security Policy

### 2. Environment Variables
- Never commit sensitive keys
- Use Netlify's environment variable system
- Rotate keys regularly

## Support

For deployment issues:
1. Check Netlify documentation
2. Review build logs
3. Test locally first
4. Contact Netlify support if needed

---

**Ready to deploy?** Run the deployment script or follow the manual steps above!