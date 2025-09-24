# 🚀 Netlify + Supabase + GitHub Deployment Guide

Complete guide for deploying 5GLabX platform using the modern stack.

## 📋 Prerequisites

- **GitHub Account** with repository access
- **Netlify Account** (free tier sufficient)
- **Supabase Account** (free tier sufficient)
- **Node.js 20+** and **pnpm 8+** installed locally

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   GitHub        │    │   Netlify       │    │   Supabase      │
│   Repository    │───▶│   Frontend      │───▶│   Backend/DB    │
│                 │    │   (Next.js)     │    │   (PostgreSQL)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                        │                        │
         │                        │                        │
         ▼                        ▼                        ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   CI/CD         │    │   Edge Functions│    │   Auth & API    │
│   Workflows     │    │   (Serverless)  │    │   (RESTful)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🔧 Step 1: GitHub Repository Setup

### 1.1 Create Repository

1. **Create new repository** on GitHub
2. **Clone locally**:
   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name
   ```

3. **Copy your 5GLabX files**:
   ```bash
   cp -r /path/to/your/5glabx/* .
   ```

### 1.2 Configure Git

```bash
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

### 1.3 Push Initial Code

```bash
git add .
git commit -m "Initial commit: 5GLabX platform setup"
git push origin main
```

## 🌐 Step 2: Supabase Setup

### 2.1 Create Project

1. **Go to [supabase.com](https://supabase.com)**
2. **Create new project** (free tier)
3. **Note your project details**:
   - Project URL: `https://your-project.supabase.co`
   - API Key: (anon/public key)
   - Service Role Key: (secret key)

### 2.2 Configure Database

```bash
# Install Supabase CLI
npm install -g supabase

# Initialize Supabase
supabase init

# Link to your project
supabase link --project-ref your-project-ref

# Run migrations
pnpm db:migrate

# Seed database
pnpm db:seed
```

### 2.3 Set Environment Variables

Add these to your Supabase project settings:

```env
# In Supabase Dashboard > Settings > API
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## ⚡ Step 3: Netlify Setup

### 3.1 Create Site

1. **Go to [netlify.com](https://netlify.com)**
2. **Click "Add new site" > "Import an existing project"**
3. **Connect to your GitHub repository**
4. **Configure build settings**:
   - **Base directory**: `/`
   - **Build command**: `pnpm build`
   - **Publish directory**: `.next`

### 3.2 Set Environment Variables

In Netlify Dashboard > Site Settings > Environment Variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# NextAuth Configuration
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=https://your-netlify-site.netlify.app

# Application Configuration
NODE_ENV=production
NEXT_PUBLIC_APP_ENV=production
NEXT_PUBLIC_BASE_URL=https://your-netlify-site.netlify.app
```

### 3.3 Configure Custom Domains (Optional)

1. **Purchase domain** or use Netlify subdomain
2. **Add custom domain** in Netlify dashboard
3. **Configure DNS** (Netlify provides instructions)
4. **Update environment variables** with your domain

## 🔄 Step 4: GitHub Actions Setup

### 4.1 Enable GitHub Actions

1. **Go to your repository**
2. **Settings > Actions > General**
3. **Enable "Read and write permissions"**

### 4.2 Add Repository Secrets

Add these to GitHub Secrets (Settings > Secrets and variables > Actions):

```env
# Netlify Configuration
NETLIFY_AUTH_TOKEN=your_netlify_auth_token
NETLIFY_STAGING_SITE_ID=your_staging_site_id
NETLIFY_PRODUCTION_SITE_ID=your_production_site_id

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Authentication
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=https://your-netlify-site.netlify.app

# Security (Optional)
SNYK_TOKEN=your_snyk_token
```

### 4.3 How to Get Tokens

#### Netlify Auth Token
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Get auth token
netlify api
```

#### Site IDs
- **Netlify Dashboard** > Site Settings > Site information > Site ID

#### NextAuth Secret
```bash
# Generate secure random secret
openssl rand -base64 32
```

## 🚀 Step 5: Deploy

### 5.1 Initial Deployment

1. **Push code to main branch**:
   ```bash
   git add .
   git commit -m "Setup deployment configuration"
   git push origin main
   ```

2. **Monitor deployment**:
   - Go to **GitHub Actions** tab
   - Watch the "Deploy to Netlify" workflow
   - Check **Netlify dashboard** for build status

### 5.2 Branch Strategy

- **main** → Production deployment
- **develop** → Staging deployment
- **feature/** → PR testing only

## 🔧 Step 6: Configuration

### 6.1 Netlify Configuration

The `netlify.toml` file is already configured:

```toml
[build]
  command = "pnpm build"
  publish = ".next"
  ignore = "/node_modules/*"

[build.environment]
  NODE_VERSION = "20.11.0"
  NODE_ENV = "production"
  NEXT_TELEMETRY_DISABLED = "1"
  CI = "false"
```

### 6.2 Supabase Configuration

Database tables and functions are configured via:

```bash
# Run migrations
pnpm db:migrate

# Seed data
pnpm db:seed
```

## 📊 Step 7: Monitoring & Management

### 7.1 Application Monitoring

- **Netlify Analytics**: Built-in traffic and performance monitoring
- **Supabase Dashboard**: Database performance and logs
- **GitHub Actions**: Deployment status and logs

### 7.2 Environment Variables Management

```bash
# List all environment variables
netlify env:list --site your-site-id

# Set environment variable
netlify env:set VARIABLE_NAME "value" --site your-site-id

# Update environment variable
netlify env:set VARIABLE_NAME "new_value" --site your-site-id
```

### 7.3 Database Management

```bash
# View database status
supabase status

# Run migrations
supabase db push

# View logs
supabase logs
```

## 🔐 Step 8: Security Configuration

### 8.1 Security Headers

Already configured in `netlify.toml`:

```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "SAMEORIGIN"
    X-Content-Type-Options = "nosniff"
    X-XSS-Protection = "1; mode=block"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

### 8.2 Authentication

- **Supabase Auth**: Built-in authentication
- **Row Level Security**: Database-level security
- **JWT Tokens**: Secure API access

### 8.3 Environment Security

- ✅ All secrets stored in GitHub Secrets
- ✅ No sensitive data in code
- ✅ Environment-specific configurations
- ✅ Security scanning via GitHub Actions

## 📈 Step 9: Performance Optimization

### 9.1 Build Optimizations

- **Code splitting**: Automatic with Next.js
- **Image optimization**: WebP/AVIF support
- **Bundle analysis**: Built-in with Next.js
- **Tree shaking**: Automatic dependency optimization

### 9.2 Runtime Optimizations

- **CDN**: Netlify global edge network
- **Caching**: Browser and CDN caching
- **Compression**: Gzip/Brotli compression
- **Service Worker**: PWA support ready

## 🚨 Step 10: Troubleshooting

### 10.1 Build Failures

```bash
# Clear cache and rebuild locally
rm -rf .next node_modules
pnpm install
pnpm build
```

### 10.2 Environment Issues

```bash
# Check environment variables
netlify env:list --site your-site-id

# View build logs
netlify logs --site your-site-id
```

### 10.3 Database Issues

```bash
# Check Supabase status
supabase status

# View database logs
supabase logs
```

### 10.4 Common Solutions

1. **Build timeout**: Increase timeout in Netlify settings
2. **Memory issues**: Enable memory increase in Netlify functions
3. **Environment variables**: Double-check all required variables
4. **Permissions**: Ensure GitHub Actions have proper permissions

## 🎉 Step 11: Post-Deployment

### 11.1 Testing

1. **Test all features** in staging
2. **Run security scans** via GitHub Actions
3. **Check performance** with Lighthouse
4. **Verify database** operations

### 11.2 DNS Configuration

```bash
# Test DNS propagation
nslookup your-domain.com

# Check SSL certificate
curl -I https://your-domain.com
```

### 11.3 Monitoring Setup

1. **Enable Netlify Analytics**
2. **Set up error monitoring** (Sentry)
3. **Configure performance monitoring**
4. **Set up uptime monitoring**

## 🔄 Step 12: Maintenance

### 12.1 Regular Updates

```bash
# Update dependencies
pnpm update

# Run security audit
pnpm audit

# Test deployment
git push origin main
```

### 12.2 Backup Strategy

- **Supabase**: Automatic daily backups
- **Code**: Git version control
- **Configuration**: Version controlled environment files

### 12.3 Scaling Considerations

- **Database**: Upgrade Supabase plan for higher limits
- **Bandwidth**: Netlify automatically scales
- **Functions**: Add more Netlify functions if needed
- **CDN**: Already included with Netlify

## 📞 Support & Resources

### Documentation
- [Netlify Docs](https://docs.netlify.com/)
- [Supabase Docs](https://supabase.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [GitHub Actions](https://docs.github.com/en/actions)

### Community
- [Netlify Community](https://community.netlify.com/)
- [Supabase Community](https://github.com/supabase/supabase/discussions)
- [5GLabX Issues](https://github.com/5glabx/platform/issues)

---

**🎉 Congratulations! Your 5GLabX platform is now deployed with:**
- ✅ **Modern tech stack**: Next.js + Supabase + Netlify
- ✅ **Automated deployments**: GitHub Actions CI/CD
- ✅ **Global CDN**: Fast worldwide delivery
- ✅ **Built-in security**: Headers, auth, RLS
- ✅ **Scalable architecture**: Serverless functions
- ✅ **Professional monitoring**: Analytics and logs

**Your platform is live at: `https://your-netlify-site.netlify.app` 🚀**