# LOUVA Project Summary - Claude Session

## Project Overview
Building a comprehensive salon loyalty management system with dual applications: Customer mobile app and Admin management app. The system features QR code scanning, real-time points tracking, rewards redemption, service management, and detailed analytics.

## Tech Stack

### Frontend
- **Framework**: Next.js 14 with App Router and TypeScript
- **Styling**: Tailwind CSS with custom dark theme and glass morphism effects
- **Icons**: Lucide React Icons
- **QR Code**: qrcode.js for generation
- **UI/UX**: Mobile-first design (375px viewport)

### Backend & Database
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Fixed accounts for prototype (no auth system)
- **Real-time**: Supabase Realtime for live updates
- **File Storage**: Supabase Storage for QR codes and images
- **API**: Next.js API Routes with Supabase client

## Fixed Account Configuration
```javascript
// Fixed accounts for prototype (no authentication)
Customer: {
  id: '550e8400-e29b-41d4-a716-446655440001',
  email: 'sari.dewi@example.com',
  name: 'Sari Dewi',
  phone: '081234567890',
  membership: 'silver',
  points: 2450,
  qr_code: 'LOUVA_SD001_2024'
}

Admin: {
  id: '550e8400-e29b-41d4-a716-446655440002',
  email: 'maya.sari@louva.com',
  name: 'Maya Sari',
  role: 'manager'
}
```

## Database Schema

### Core Tables
- **users**: Customer profiles with membership levels (bronze/silver/gold), points tracking
- **admins**: Admin accounts with role management
- **services**: Service catalog with pricing and point multipliers
- **payment_methods**: Configurable payment options (Cash, QRIS, Debit Cards)
- **transactions**: Transaction records with payment details
- **transaction_services**: Many-to-many for services in transactions
- **points_history**: Complete audit trail of point changes
- **rewards**: Available rewards catalog
- **reward_redemptions**: Reward redemption tracking

## Application Structure

### Customer App (`/customer`)
- **Pages**:
  - Home: Points display, promo banners, quick QR access
  - Services: Grid layout with categories (Hair, Treatments, Nail)
  - QR Modal: Full-screen QR code display with customer info
  - Rewards: Available rewards with point requirements
  - Account: Profile, statistics, transaction history, settings
- **Navigation**: Bottom tab bar (Home, Services, My Card, Rewards, Account)
- **Key Features**:
  - Real-time points tracking
  - QR code generation with unique format: `LOUVA_[USER_ID]_[TIMESTAMP]`
  - Service catalog with pricing
  - Rewards redemption
  - Transaction history

### Admin App (`/admin`)
- **Pages**:
  - Dashboard: Key metrics, quick actions, recent activities
  - Scanner: QR code scanning with camera simulation
  - Transaction Form: Service selection, payment method recording
  - Customer Management: Search, view, edit customer profiles
  - Service Management: Add/edit/remove services, pricing
  - Reports & Analytics: Revenue, customer insights, service popularity
  - Settings: Admin profile, salon configuration
- **Navigation**: Bottom tab bar (Dashboard, Customers, Scanner, Reports, Settings)
- **Key Features**:
  - QR scanner for customer identification
  - Multi-service transaction processing
  - Payment method selection and recording
  - Real-time dashboard updates
  - Customer relationship management
  - Analytics and reporting

## UI/UX Design System

### Admin App Color Palette (from prototype)
```css
--primary: #4A8BC2 (Main blue)
--primary-light: #5A9BD4
--primary-dark: #3A7BB2
--secondary: #1B3B32 (Dark green)
--secondary-light: #2d5548
--accent: #93BEE1 (Light blue)
--accent-dark: #7ba6d3
--success: #00d4aa
--warning: #ffa726
--error: #ff5252
--text-primary: #ffffff
--text-secondary: #b0b8c1
--text-muted: #6b7785
--surface: #0a1620 (Darkest background)
--surface-light: #1a2832
--surface-lighter: #243442
--border: #2d3748
```

### Customer App Color Palette
- **Primary**: #4A8BC2 (blue)
- **Secondary**: #1B3B32 (dark green)
- **Accent**: #93BEE1 (light blue)
- **Success**: #00d4aa
- **Warning**: #ffa726
- **Error**: #ff5252

### Design Patterns
- **Theme**: Dark mode with gradient backgrounds
- **Typography**: DM Sans font family
- **Layout**:
  - Glass morphism cards, smooth animations, hover effects
  - Rounded corners (16px) for admin components
  - Backdrop blur effects for navigation
  - Mobile-first design (375px viewport)
- **Admin App Specific**:
  - Gradient headers with admin info and stats
  - Quick Actions: 2x2 grid with shimmer hover effects
  - Scanner frame with animated scan line and corner markers
  - Bottom navigation with backdrop blur
- **Components**: Consistent button styles, form inputs, modals

## API Endpoints

### Customer-Facing APIs
- `GET /api/user/profile` - Get customer profile
- `GET /api/user/points` - Points balance and history
- `GET /api/user/transactions` - Transaction history
- `GET /api/services` - Service catalog
- `GET /api/rewards` - Available rewards
- `POST /api/rewards/redeem` - Redeem rewards

### Admin APIs
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/customers` - Customer list with search
- `POST /api/admin/customers` - Add new customer
- `GET /api/admin/services` - Service management
- `POST /api/admin/services` - Add new service
- `GET /api/admin/payment-methods` - Payment method management
- `GET /api/admin/reports` - Analytics data

### Transaction APIs
- `POST /api/scan/verify` - QR code verification
- `GET /api/scan/customer/:qr` - Customer lookup by QR
- `POST /api/transactions` - Create transaction
- `PUT /api/transactions/:id` - Update transaction

## Points System
- **Earning Rate**: 1 point per Rp 1,000 (configurable per service)
- **Membership Levels**:
  - Bronze: 0-999 points
  - Silver: 1,000-4,999 points
  - Gold: 5,000+ points
- **Point Calculation**: `Math.floor(amount / 1000 * multiplier)`
- **History Tracking**: Complete audit trail in points_history table

## Transaction Flow
1. Admin scans customer QR code (5-minute expiry)
2. System loads customer information and current points
3. Admin selects services (multi-select)
4. System calculates total amount and points to earn
5. Admin selects payment method from configured options
6. Admin can add payment notes
7. Transaction is recorded with all details
8. Points are automatically awarded
9. Receipt/notification generated

## Current Status ✅

### Completed (Last Session)
1. **Next.js Setup**
   - Project initialized with Next.js 14 + TypeScript
   - Tailwind CSS configured with dark theme
   - Dependencies installed (Supabase, QR libraries, icons)
   - Development server running on localhost:3000

2. **Project Structure**
   - Directory structure created as per guide-to-code documentation
   - All necessary folders for customer/admin apps, components, lib, hooks, API

3. **Shared Components Built**
   - Button, Input, Card, Badge, Modal components
   - Dark theme styling with glass morphism effects
   - Mobile-first responsive design (375px)

4. **Utilities & Types**
   - Helper functions (formatCurrency, calculatePoints, etc.)
   - TypeScript interfaces for all data models
   - Constants for services, payments, membership levels

5. **Customer Components**
   - BottomNav component for navigation
   - ServiceGrid component for displaying services
   - QRModal component for loyalty QR code
   - PointsDisplay component (completed)

6. **Customer Pages**
   - Home page with points display and quick actions
   - Services page with category filters
   - QR page for code generation and display
   - Rewards page with redemption system
   - Account page with profile management

7. **Customer App Layout**
   - Mobile-first layout with bottom navigation
   - Safe area support for mobile devices

## Key Technical Decisions
- **Authentication**: Fixed accounts for prototype (Sari Dewi - Customer, Maya Sari - Admin)
- **QR System**: Customer ID + timestamp, 5-minute expiry for security
- **Points**: 1 point per Rp 1.000 (configurable per service)
- **Storage**: Supabase for database + image storage
- **Payment**: Recording only (no actual payment processing)

## Next Steps Priority Order

### 1. Complete Customer App ✅
- ✅ Finish PointsDisplay component
- ✅ Create customer Home page
- ✅ Create customer Services page
- ✅ Create customer QR page
- ✅ Create customer Rewards page
- ✅ Create customer Account page
- ✅ Implement customer app layout

### 2. Complete Admin App
- ⏳ Create Admin layout and navigation
- ⏳ Create QR Scanner component
- ⏳ Create Transaction Form component
- ⏳ Create Customer Management page
- ⏳ Create Service Management page
- ⏳ Create Reports & Analytics page
- ⏳ Create Settings page

### 3. Setup Supabase
- Create Supabase project
- Set up database schema (customers, services, transactions, rewards, redemptions)
- Configure storage buckets for images

### 4. Build API Routes
- Customer endpoints (profile, transactions)
- Admin endpoints (services, customers, reports)
- QR verification endpoint
- Transaction processing

### 5. Admin App Development
- Admin layout and navigation
- QR Scanner component
- Customer management interface
- Transaction form
- Reports and analytics dashboard

## Environment Variables to Configure
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Fixed Accounts
FIXED_CUSTOMER_ID=550e8400-e29b-41d4-a716-446655440001
FIXED_CUSTOMER_EMAIL=sari.dewi@example.com
FIXED_ADMIN_ID=550e8400-e29b-41d4-a716-446655440002
FIXED_ADMIN_EMAIL=maya.sari@louva.com

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
JWT_SECRET=your_jwt_secret
```

## Development Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
```

## Current Working State
- Development server is running (process ID: b64c166)
- TODO.md contains detailed task list
- Project ready for Supabase integration
- Components structure established

## File Locations
- Main app: `src/app/`
- Components: `src/components/`
- Utilities: `src/lib/`
- Configuration files in root directory

## Notes for Resume
- **Customer App is 100% complete** with all pages and components
- All customer pages are functional: Home, Services, QR, Rewards, Account
- Customer app layout with bottom navigation is implemented
- **Next priority is Admin App development** - no admin components/pages exist yet
- Supabase project needs to be created before any API functionality
- Database schema is documented in guide-to-code files
- All shared components are ready for use