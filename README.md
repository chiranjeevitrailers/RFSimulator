# 5GLabX Platform

**Professional 5G Protocol Simulator & Analysis Platform**

A comprehensive platform for 5G protocol simulation, analysis, and testing with support for srsRAN, Open5GS, and Kamailio IMS.

## 🚀 Features

### Core Platform
- **Protocol Simulator**: Complete 5G/4G protocol simulation with 1000+ test cases
- **Real-time Analysis**: Live protocol analysis and visualization
- **Multi-layer Support**: PHY, MAC, RLC, PDCP, RRC, NAS, IMS, SIP layers
- **3GPP Compliance**: Full compliance with 3GPP standards

### Advanced Features
- **User Dashboard**: Comprehensive user interface for protocol testing
- **Admin Dashboard**: Complete platform management and monitoring
- **Analytics & Reporting**: Advanced analytics with detailed reporting
- **Performance Optimization**: Multi-strategy caching and optimization
- **Security Hardening**: Enterprise-grade security with RBAC
- **API Documentation**: Complete API documentation with testing interface
- **Monitoring & Alerting**: Real-time monitoring with intelligent alerting
- **Backup & Recovery**: Comprehensive backup and disaster recovery
- **Load Testing**: Advanced load testing and scalability analysis
- **CI/CD Pipeline**: Complete deployment and continuous integration

### Technology Stack
- **Frontend**: Next.js 15, React 18, TypeScript, TailwindCSS
- **Hosting**: Netlify (Static Site Hosting + Edge CDN)
- **Backend**: Supabase (Backend-as-a-Service)
- **Database**: PostgreSQL with Supabase
- **CI/CD**: GitHub Actions + Netlify Functions
- **CDN**: Standard unpkg.com and jsdelivr.net CDNs
- **Authentication**: Supabase Auth with RBAC
- **Deployment**: Netlify with CI/CD
- **Monitoring**: Custom monitoring system with alerts
- **Testing**: Jest, Playwright, Artillery

## 📋 Prerequisites

- Node.js 18+ 
- pnpm 8+
- Supabase account
- Netlify account (for deployment)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/5glabx/platform.git
   cd platform
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure the following variables:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Set up Supabase**
   ```bash
   # Install Supabase CLI
   npm install -g supabase
   
   # Initialize Supabase
   supabase init
   
   # Start local Supabase
   supabase start
   
   # Run migrations
   pnpm db:migrate
   
   # Seed database
   pnpm db:seed
   ```

5. **Start development server**
   ```bash
   pnpm dev
   ```

## 🏗️ Project Structure

```
5glabx-platform/
├── app/                    # Next.js app directory
│   ├── admin-dashboard/    # Admin dashboard pages
│   ├── user-dashboard/     # User dashboard pages (functionalities removed)
│   ├── api/               # API routes
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── admin/            # Admin components
│   ├── user/             # User components
│   ├── monitoring/       # Monitoring components
│   ├── backup/           # Backup components
│   ├── load-testing/     # Load testing components
│   └── deployment/       # Deployment components
├── lib/                  # Utility libraries
│   ├── supabase.ts       # Supabase client
│   ├── auth.ts           # Authentication
│   ├── monitoring-system.ts
│   ├── backup-manager.ts
│   ├── load-testing-manager.ts
│   └── deployment-manager.ts
├── supabase/             # Supabase configuration
│   └── migrations/       # Database migrations
├── .github/              # GitHub workflows
│   └── workflows/        # CI/CD pipelines
├── public/               # Static assets
└── types/                # TypeScript types
```

## 🚀 Deployment

### Staging Deployment
```bash
# Deploy to staging
pnpm deploy:staging
```

### Production Deployment
```bash
# Deploy to production
pnpm deploy:production
```

### Manual Deployment
1. Build the application: `pnpm build`
2. Deploy to Netlify: `netlify deploy --dir=.next --prod`

## 🧪 Testing

### Unit Tests
```bash
pnpm test
```

### E2E Tests
```bash
pnpm test:e2e
```

### Load Tests
```bash
pnpm test:load
```

### Security Tests
```bash
pnpm security
```

## 📊 Monitoring

The platform includes comprehensive monitoring:

- **System Metrics**: CPU, memory, disk, network usage
- **Application Metrics**: Response times, error rates, throughput
- **Database Metrics**: Query performance, connection pools
- **Alert Management**: Configurable alerts with multiple channels
- **Health Checks**: Automated health monitoring
- **Performance Monitoring**: Real-time performance tracking

## 🔒 Security

- **Authentication**: Supabase Auth with JWT tokens
- **Authorization**: Role-based access control (RBAC)
- **Data Protection**: Row-level security (RLS)
- **API Security**: Rate limiting, input validation
- **Headers**: Security headers for XSS, CSRF protection
- **Audit Logging**: Comprehensive audit trails

## 📈 Performance

- **Caching**: Multi-strategy caching (Redis, CDN, browser)
- **Optimization**: Code splitting, lazy loading, compression
- **CDN**: Global content delivery network
- **Database**: Query optimization, connection pooling
- **Monitoring**: Real-time performance monitoring

## 🔄 CI/CD

The platform includes a complete CI/CD pipeline:

- **Code Quality**: ESLint, Prettier, TypeScript checks
- **Testing**: Unit, integration, and E2E tests
- **Security**: Automated security scanning
- **Deployment**: Automated staging and production deployments
- **Monitoring**: Post-deployment health checks

## 📚 API Documentation

Complete API documentation is available at `/api/docs` with:
- Interactive API explorer
- Request/response examples
- Authentication guides
- Rate limiting information

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.5glabx.com](https://docs.5glabx.com)
- **Issues**: [GitHub Issues](https://github.com/5glabx/platform/issues)
- **Discussions**: [GitHub Discussions](https://github.com/5glabx/platform/discussions)
- **Email**: support@5glabx.com

## 🎯 Roadmap

- [ ] Mobile app development
- [ ] Advanced protocol analysis
- [ ] Machine learning integration
- [ ] Multi-tenant architecture
- [ ] Advanced reporting features
- [ ] Integration with more 5G tools

## 🙏 Acknowledgments

- srsRAN Project
- Open5GS Community
- Kamailio IMS
- 3GPP Standards
- Next.js Team
- Supabase Team
- Netlify Team

---

**Built with ❤️ by the 5GLabX Team**