# 🚀 5GLabX Platform Deployment Guide

This guide provides step-by-step instructions for deploying the 5GLabX platform to Netlify with all required dependencies.

## 📋 Prerequisites

Before starting the deployment process, ensure you have:

- **Node.js 18+** installed
- **pnpm 8+** installed
- **Git** installed
- **Netlify account** (free tier is sufficient)
- **Supabase account** (free tier is sufficient)

## 🛠️ Quick Start

### 1. Install Dependencies

Run the automated dependency installation script:

```bash
./scripts/install-dependencies.sh
```

This script will:
- Check system requirements
- Install global dependencies (Netlify CLI, Supabase CLI, TypeScript)
- Install project dependencies using pnpm
- Set up environment configuration
- Verify installation

### 2. Set Up Environment Variables

Copy the example environment file and configure it:

```bash
cp .env.example .env.local
```

Update `.env.local` with your actual values:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# NextAuth Configuration
NEXTAUTH_SECRET=your_nextauth_secret_key_here
NEXTAUTH_URL=http://localhost:3000

# Netlify Configuration
NETLIFY_AUTH_TOKEN=your_netlify_auth_token
NETLIFY_SITE_ID=your_netlify_site_id
```

### 3. Set Up Supabase Database

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the database migrations:

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Initialize Supabase (if not already done)
supabase init

# Link to your Supabase project
supabase link --project-ref your-project-ref

# Run migrations
pnpm db:migrate

# Seed the database
pnpm db:seed
```

### 4. Set Up Netlify

Run the automated Netlify setup script:

```bash
./scripts/setup-netlify.sh
```

This script will:
- Install and configure Netlify CLI
- Create staging and production sites
- Set up environment variables
- Configure custom domains
- Set up SSL certificates
- Configure form handling and functions
- Set up build hooks and monitoring

### 5. Deploy to Netlify

Deploy to staging:

```bash
./scripts/deploy.sh staging
```

Deploy to production:

```bash
./scripts/deploy.sh production
```

## 🔧 Manual Setup (Alternative)

If you prefer to set up everything manually, follow these steps:

### 1. Install Dependencies

```bash
# Install global dependencies
npm install -g netlify-cli
npm install -g supabase
npm install -g pnpm@8

# Install project dependencies
pnpm install
```

### 2. Build the Application

```bash
pnpm build
```

### 3. Deploy to Netlify

```bash
# Login to Netlify
netlify login

# Deploy to staging
netlify deploy --dir=.next --prod --site=your-staging-site-id

# Deploy to production
netlify deploy --dir=.next --prod --site=your-production-site-id
```

## 🌐 Environment Configuration

### Staging Environment

- **URL**: `https://staging.5glabx.com`
- **API URL**: `https://staging-api.5glabx.com`
- **Database**: Staging Supabase project
- **Features**: All features enabled for testing

### Production Environment

- **URL**: `https://5glabx.com`
- **API URL**: `https://api.5glabx.com`
- **Database**: Production Supabase project
- **Features**: All features enabled

## 🔐 Security Configuration

The platform includes comprehensive security features:

### Headers
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

### Authentication
- Supabase Auth with JWT tokens
- Role-based access control (RBAC)
- Row-level security (RLS)

### API Security
- Rate limiting
- Input validation
- CORS configuration
- Webhook signature verification

## 📊 Monitoring & Analytics

### Built-in Monitoring
- Health checks at `/api/health`
- Performance monitoring
- Error tracking
- User activity analytics

### Netlify Analytics
- Page views and traffic
- Performance metrics
- Form submissions
- Function invocations

### Custom Monitoring
- Real-time system metrics
- Database performance
- API response times
- User engagement metrics

## 🚨 Troubleshooting

### Common Issues

#### 1. Build Failures
```bash
# Clear cache and rebuild
rm -rf .next node_modules
pnpm install
pnpm build
```

#### 2. Environment Variable Issues
- Ensure all required environment variables are set
- Check that Supabase URLs and keys are correct
- Verify Netlify environment variables are configured

#### 3. Database Connection Issues
- Verify Supabase project is active
- Check database migrations are applied
- Ensure RLS policies are configured

#### 4. Deployment Issues
- Check Netlify build logs
- Verify build command and publish directory
- Ensure all dependencies are installed

### Debug Commands

```bash
# Check environment variables
netlify env:list --site your-site-id

# View build logs
netlify logs --site your-site-id

# Test functions locally
netlify functions:serve

# Check site status
netlify status
```

## 📈 Performance Optimization

### Build Optimizations
- Code splitting and lazy loading
- Image optimization (WebP, AVIF)
- Bundle analysis and optimization
- Tree shaking for unused code

### Runtime Optimizations
- CDN caching
- Browser caching
- Compression (gzip, brotli)
- Service worker for offline support

### Database Optimizations
- Connection pooling
- Query optimization
- Indexing strategies
- Caching layers

## 🔄 CI/CD Pipeline

The platform includes a complete CI/CD pipeline:

### GitHub Actions Workflow
- **Code Quality**: ESLint, TypeScript, Prettier
- **Testing**: Unit tests, integration tests, E2E tests
- **Security**: Snyk scanning, CodeQL analysis
- **Deployment**: Automated staging and production deployment
- **Monitoring**: Post-deployment health checks

### Deployment Triggers
- **Push to main**: Deploy to production
- **Push to develop**: Deploy to staging
- **Pull requests**: Run tests and security scans
- **Manual**: Trigger deployment via GitHub Actions

## 📞 Support

If you encounter any issues during deployment:

1. **Check the logs**: Review build and deployment logs
2. **Verify configuration**: Ensure all environment variables are correct
3. **Test locally**: Run the application locally to identify issues
4. **Contact support**: Reach out to the development team

### Useful Resources
- [Netlify Documentation](https://docs.netlify.com/)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

---

**Happy Deploying! 🚀**