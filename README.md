# 5GLabX Protocol Simulator Platform

A professional 3GPP Protocol Simulator platform for 5G/4G network analysis, testing, and learning.

## 🚀 Features

### Core Platform
- **1000+ Test Cases** across 4G LTE, 5G NR, IMS/SIP, O-RAN, NB-IoT, V2X, and NTN
- **Real-time Protocol Simulation** with authentic 3GPP-compliant values
- **Professional Protocol Analyzer** interface
- **Layer-by-Layer Analysis** (PHY, MAC, RLC, PDCP, RRC, NAS)
- **3GPP Message Decoder** with ASN.1 support
- **Real-time Data Streaming** and visualization

### User Experience
- **Professional Homepage** with marketing content
- **User Dashboard** for test execution and analysis
- **Admin Dashboard** for user and platform management
- **Mobile Responsive** design
- **Authentication System** with role-based access

### Technical Stack
- **Frontend**: Next.js 14, React 18, TailwindCSS
- **Backend**: Supabase (Database, Auth, Real-time)
- **Deployment**: Netlify
- **Authentication**: Supabase Auth with custom admin system
- **Database**: PostgreSQL with Row Level Security

## 📋 Project Structure

```
5glabx-protocol-simulator/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── admin-dashboard/   # Admin dashboard
│   ├── user-dashboard/    # User dashboard
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── auth/             # Authentication components
│   ├── dashboard/        # Dashboard components
│   └── marketing/        # Marketing page components
├── lib/                  # Utility libraries
│   ├── supabase.ts       # Supabase client and types
│   ├── auth.ts           # Authentication service
│   └── utils.ts          # Utility functions
├── supabase/             # Database migrations and seed data
│   ├── migrations/       # Database schema
│   └── seed.sql          # Sample data
└── public/               # Static assets
```

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Netlify account (for deployment)

### 1. Clone and Install
```bash
git clone <repository-url>
cd 5glabx-protocol-simulator
npm install
```

### 2. Environment Setup
```bash
cp .env.local.example .env.local
```

Update `.env.local` with your credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
ADMIN_EMAIL=admin@5glabx.com
ADMIN_PASSWORD=your_admin_password
```

### 3. Database Setup
```bash
# Run migrations
supabase db reset

# Or manually run the migration
psql -h your-db-host -U postgres -d postgres -f supabase/migrations/001_initial_schema.sql

# Seed with sample data
psql -h your-db-host -U postgres -d postgres -f supabase/seed.sql
```

### 4. Development
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 🎯 User Flows

### Admin Flow
1. **Login** → Admin Dashboard
2. **User Management** → View/Manage users
3. **Test Case Management** → Create/Edit test cases
4. **Analytics** → View platform metrics
5. **System Monitoring** → Monitor platform health

### User Flow
1. **Signup/Login** → User Dashboard
2. **Browse Test Cases** → Select test case
3. **Execute Test** → Real-time simulation
4. **Analyze Results** → Protocol analysis
5. **View Statistics** → Performance metrics

## 📊 Test Case Categories

### 4G LTE (150 scenarios)
- RRC Connection Setup/Release
- NAS Attach/Detach Procedures
- Handover Procedures
- MAC Scheduling
- PHY Measurements

### 5G NR (150 scenarios)
- Initial Access Procedures
- Registration and PDU Session
- Beam Management
- Dual Connectivity
- Carrier Aggregation

### IMS/SIP (100 scenarios)
- SIP Registration
- Call Establishment
- Call Transfer
- Media Negotiation
- IMS Core Procedures

### O-RAN (100 scenarios)
- F1 Interface Procedures
- E2 Interface Procedures
- SMO Integration
- xApps/rApps

### NB-IoT (50 scenarios)
- Coverage Enhancement
- Power Saving Modes
- Extended DRX
- Random Access

### V2X (50 scenarios)
- V2V Communication
- V2I Communication
- Sidelink Procedures
- Safety Applications

### NTN (50 scenarios)
- Satellite Access
- Doppler Compensation
- Long Delay Handling
- Handover Procedures

## 🔐 Authentication

### Admin Authentication
- Simple email/password authentication
- Admin credentials stored in environment variables
- Redirects to Admin Dashboard

### User Authentication
- Supabase Auth integration
- Email/password registration and login
- Redirects to User Dashboard
- Users appear in Admin Dashboard for management

## 🚀 Deployment

### Netlify Deployment
1. Connect repository to Netlify
2. Set environment variables
3. Configure build settings
4. Deploy

### Environment Variables for Production
```env
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_supabase_anon_key
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=your_secure_admin_password
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

## 📈 Roadmap

### Phase 1: Foundation (Weeks 1-8) ✅
- [x] Project setup and Supabase integration
- [x] Homepage with marketing content
- [x] Authentication system
- [x] Admin dashboard with user management

### Phase 2: Core Platform (Weeks 9-16)
- [ ] Test case database and management
- [ ] Protocol simulation engine
- [ ] 1000+ test cases implementation
- [ ] Real-time data streaming

### Phase 3: User Dashboard (Weeks 17-24)
- [ ] User dashboard interface
- [ ] Test execution system
- [ ] Protocol analyzer
- [ ] Statistics and analytics

### Phase 4: Advanced Features (Weeks 25-32)
- [ ] Custom test case builder
- [ ] Advanced analytics
- [ ] API access
- [ ] Enterprise features

### Phase 5: Launch (Weeks 33-40)
- [ ] Production deployment
- [ ] Beta testing
- [ ] Marketing and launch
- [ ] Post-launch optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Email: support@5glabx.com
- Documentation: [docs.5glabx.com](https://docs.5glabx.com)
- Issues: [GitHub Issues](https://github.com/5glabx/protocol-simulator/issues)

---

**5GLabX Protocol Simulator** - Professional 3GPP Network Analysis Platform