# LOUVA Salon Loyalty App - TODO List

## Current Progress ✅

### Completed Tasks
- [x] Configure Next.js project with dependencies and environment variables
- [x] Set up project structure (directories, files)
- [x] Install and configure dependencies (Next.js 14, TypeScript, Tailwind CSS, Supabase, QR libraries)
- [x] Create basic shared components (Button, Input, Card, Badge, Modal)
- [x] Create utility functions and constants
- [x] Start customer app components (BottomNav, ServiceGrid, QRModal)

### Completed Tasks
- [x] Build customer app pages and components
  - [x] BottomNav component
  - [x] ServiceGrid component
  - [x] QRModal component
  - [x] PointsDisplay component
  - [x] Customer pages (Home, Services, QR, Rewards, Account)
  - [x] Customer app layout

### In Progress Tasks
- [🔄] Build admin app pages and components
  - [ ] Admin layout and navigation
  - [ ] QR Scanner component
  - [ ] Transaction Form component
  - [ ] Customer Management page
  - [ ] Service Management page
  - [ ] Reports & Analytics page
  - [ ] Settings page

### Pending Tasks

#### High Priority
- [ ] Set up Supabase project with database schema and storage buckets
- [ ] Create database tables (customers, services, transactions, rewards, redemptions)
- [ ] Create API routes for all operations
- [ ] Build admin app pages and components
- [ ] Implement QR code generation and scanning functionality

#### Medium Priority
- [ ] Set up Supabase storage buckets for images (profiles, loyalty cards, service images)
- [ ] Test all functionality and fix any issues

## Project Structure

### Configuration Files
- ✅ package.json
- ✅ tsconfig.json
- ✅ tailwind.config.js
- ✅ next.config.js
- ✅ .env.local
- ✅ .gitignore

### App Structure
- ✅ src/app/layout.tsx
- ✅ src/app/globals.css
- ✅ src/app/page.tsx
- ✅ Directory structure created

### Shared Components (src/components/shared/)
- ✅ Button.tsx
- ✅ Input.tsx
- ✅ Card.tsx
- ✅ Badge.tsx
- ✅ Modal.tsx

### Customer Components (src/components/customer/)
- ✅ BottomNav.tsx
- ✅ ServiceGrid.tsx
- ✅ QRModal.tsx
- ✅ PointsDisplay.tsx

### Admin Components (src/components/admin/)
- [ ] QRScanner.tsx
- [ ] CustomerInfo.tsx
- [ ] ServiceSelector.tsx
- [ ] PaymentSelector.tsx
- [ ] TransactionForm.tsx
- [ ] PaymentMethodManager.tsx
- [ ] DashboardStats.tsx
- [ ] ReportsChart.tsx

### Utilities & Types
- ✅ src/lib/utils.ts
- ✅ src/lib/constants.ts
- ✅ src/lib/types.ts

## Next Session Priorities

1. **Complete Admin Components**
   - Admin layout and navigation
   - QR Scanner component
   - Transaction Form component
   - Customer management interface
   - Service management interface
   - Reports and analytics dashboard

2. **Setup Supabase**
   - Create Supabase project
   - Set up database schema
   - Configure storage buckets
   - Connect Next.js to Supabase

3. **Build API Routes**
   - Customer endpoints
   - Admin endpoints
   - QR verification
   - Transaction processing

4. **Admin App Components**
   - Admin layout
   - Scanner component
   - Customer management
   - Transaction processing
   - Reports and analytics

## Technical Requirements

### Database Schema
- customers table
- services table
- transactions table
- rewards table
- redemptions table
- admins table

### API Endpoints
- GET/POST /api/user
- GET/POST /api/transactions
- POST /api/scan/verify
- GET/POST /api/admin/services
- GET/POST /api/admin/customers
- GET/POST /api/admin/payment-methods

### Features to Implement
- QR code generation (customer ID + timestamp)
- QR code scanning and validation
- Points calculation system
- Membership levels (Bronze, Silver, Gold)
- Transaction recording
- Reward redemption

### Storage Requirements
- Profile photos bucket
- Loyalty card images bucket
- Service images bucket
- Reward images bucket

## Notes
- Using fixed accounts for prototype (Sari Dewi - Customer, Maya Sari - Admin)
- Payment is recording only, no actual payment processing
- 1 point per Rp 1.000 (configurable per service)
- Mobile-first design (375px width)
- Dark theme with gradient backgrounds
- Real-time updates via Supabase subscriptions

## Environment Variables Needed
- Supabase URL and keys
- Fixed account credentials
- App configuration
- Development settings