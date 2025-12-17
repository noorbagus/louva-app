# LOUVA Loyalty App - Project Plan

## Project Overview
Full-stack loyalty system with Admin and Customer apps featuring QR code scanning, point management, service selection, and payment processing.

## Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + CSS Variables (maintaining existing design)
- **Icons**: Material Icons
- **QR Code**: 
  - Generation: `qrcode.js`
  - Scanning: `@zxing/library` or `qr-scanner`
- **State Management**: Zustand (lightweight)
- **HTTP Client**: Built-in fetch with custom hooks

### Backend & Database
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Real-time**: Supabase Realtime
- **File Storage**: Supabase Storage (for QR codes, avatars)
- **API**: Next.js API Routes + Supabase Client

### Deployment
- **Frontend**: Vercel
- **Database**: Supabase Cloud
- **Domain**: Custom domain via Vercel
- **SSL**: Automatic via Vercel

## Database Schema

### Tables

```sql
-- Users table (customers) - with fixed test data
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR UNIQUE NOT NULL,
  full_name VARCHAR NOT NULL,
  phone VARCHAR,
  membership_level VARCHAR DEFAULT 'bronze', -- bronze, silver, gold
  total_points INTEGER DEFAULT 0,
  total_visits INTEGER DEFAULT 0,
  total_spent DECIMAL(12,2) DEFAULT 0,
  qr_code VARCHAR UNIQUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert fixed customer account
INSERT INTO users (id, email, full_name, phone, membership_level, total_points, total_visits, total_spent, qr_code) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'sari.dewi@example.com', 'Sari Dewi', '081234567890', 'silver', 2450, 15, 3200000, 'LOUVA_SD001_2024');

-- Admins table - with fixed test data
CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR UNIQUE NOT NULL,
  full_name VARCHAR NOT NULL,
  role VARCHAR DEFAULT 'manager', -- manager, staff
  salon_id UUID,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert fixed admin account
INSERT INTO admins (id, email, full_name, role) VALUES
('550e8400-e29b-41d4-a716-446655440002', 'maya.sari@louva.com', 'Maya Sari', 'manager');

-- Services table
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  category VARCHAR NOT NULL, -- hair, treatment, nail, other
  description TEXT,
  min_price DECIMAL(10,2) NOT NULL,
  max_price DECIMAL(10,2),
  points_multiplier DECIMAL(3,2) DEFAULT 1.0, -- points per 1000 IDR
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Payment methods table (admin configurable)
CREATE TABLE payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL, -- e.g., "Cash", "QRIS", "Debit BCA"
  type VARCHAR NOT NULL, -- cash, qris, debit, credit
  bank VARCHAR, -- mandiri, bca, other (for cards)
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert default payment methods
INSERT INTO payment_methods (name, type, bank) VALUES
('Cash', 'cash', NULL),
('QRIS', 'qris', NULL),
('Debit Mandiri', 'debit', 'mandiri'),
('Debit BCA', 'debit', 'bca'),
('Debit Other', 'debit', 'other'),
('Credit Mandiri', 'credit', 'mandiri'),
('Credit BCA', 'credit', 'bca'),
('Credit Other', 'credit', 'other');

-- Transactions table
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  admin_id UUID REFERENCES admins(id),
  payment_method_id UUID REFERENCES payment_methods(id),
  total_amount DECIMAL(10,2) NOT NULL,
  points_earned INTEGER NOT NULL,
  status VARCHAR DEFAULT 'completed', -- pending, completed, cancelled
  notes TEXT, -- additional payment notes
  created_at TIMESTAMP DEFAULT NOW()
);

-- Transaction services (many-to-many)
CREATE TABLE transaction_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID REFERENCES transactions(id),
  service_id UUID REFERENCES services(id),
  price DECIMAL(10,2) NOT NULL,
  points_earned INTEGER NOT NULL
);

-- Points history
CREATE TABLE points_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  transaction_id UUID REFERENCES transactions(id),
  points_change INTEGER NOT NULL, -- positive for earn, negative for redeem
  balance_after INTEGER NOT NULL,
  type VARCHAR NOT NULL, -- earn, redeem
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Rewards table
CREATE TABLE rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  description TEXT,
  points_required INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Reward redemptions
CREATE TABLE reward_redemptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  reward_id UUID REFERENCES rewards(id),
  points_used INTEGER NOT NULL,
  status VARCHAR DEFAULT 'pending', -- pending, completed, cancelled
  redeemed_at TIMESTAMP DEFAULT NOW()
);
```

## API Endpoints

### Fixed Account Configuration
```javascript
// Fixed accounts for prototype
const FIXED_CUSTOMER = {
  id: '550e8400-e29b-41d4-a716-446655440001',
  email: 'sari.dewi@example.com',
  full_name: 'Sari Dewi',
  qr_code: 'LOUVA_SD001_2024'
};

const FIXED_ADMIN = {
  id: '550e8400-e29b-41d4-a716-446655440002',
  email: 'maya.sari@louva.com',
  full_name: 'Maya Sari'
};
```

### Customer App APIs
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update profile
- `GET /api/user/points` - Get points balance & history
- `GET /api/user/transactions` - Transaction history
- `GET /api/services` - Get all services
- `GET /api/rewards` - Get available rewards
- `POST /api/rewards/redeem` - Redeem reward

### Admin App APIs
- `GET /api/admin/dashboard` - Dashboard stats
- `GET /api/admin/customers` - Customer management
- `POST /api/admin/customers` - Add customer
- `PUT /api/admin/customers/:id` - Update customer
- `DELETE /api/admin/customers/:id` - Delete customer

### Payment Management APIs
- `GET /api/admin/payment-methods` - Get all payment methods
- `POST /api/admin/payment-methods` - Add new payment method
- `PUT /api/admin/payment-methods/:id` - Update payment method
- `DELETE /api/admin/payment-methods/:id` - Deactivate payment method

### Scanner & Transaction APIs
- `POST /api/scan/verify` - Verify QR code
- `GET /api/scan/customer/:qr` - Get customer by QR
- `POST /api/transactions` - Create transaction
- `PUT /api/transactions/:id` - Update transaction

### Service Management
- `GET /api/admin/services` - Get all services
- `POST /api/admin/services` - Add service
- `PUT /api/admin/services/:id` - Update service
- `DELETE /api/admin/services/:id` - Delete service

## Core Features Implementation

### 1. QR Code System
```javascript
// QR Generation (unique per user)
const generateQR = (userId) => {
  return `LOUVA_${userId}_${timestamp}`;
};

// QR Scanning
const handleScan = async (qrData) => {
  const response = await fetch('/api/scan/verify', {
    method: 'POST',
    body: JSON.stringify({ qrCode: qrData })
  });
  return response.json();
};
```

### 2. Points System
```javascript
// Calculate points
const calculatePoints = (amount, multiplier = 1.0) => {
  return Math.floor(amount / 1000 * multiplier);
};

// Update user points
const updateUserPoints = async (userId, pointsToAdd) => {
  // Update user total_points
  // Insert into points_history
  // Check for membership level upgrade
};
```

### 3. Payment Recording System
```javascript
// Payment method selection
const PaymentSelector = ({ onSelect, paymentMethods }) => {
  return (
    <div className="payment-grid">
      {paymentMethods.map(method => (
        <button 
          key={method.id}
          onClick={() => onSelect(method)}
          className="payment-option"
        >
          <Icon type={method.type} bank={method.bank} />
          <span>{method.name}</span>
        </button>
      ))}
    </div>
  );
};

// Transaction with payment recording
const createTransaction = async (transactionData) => {
  const transaction = {
    user_id: transactionData.userId,
    admin_id: transactionData.adminId,
    payment_method_id: transactionData.paymentMethodId,
    total_amount: transactionData.total,
    points_earned: calculatePoints(transactionData.total),
    notes: transactionData.paymentNotes
  };
  
  return await supabase
    .from('transactions')
    .insert(transaction);
};
```

### 4. Transaction Flow
### 4. Transaction Flow
1. Admin scans customer QR
2. Customer data loads
3. Admin selects services
4. System calculates total & points
5. Admin selects payment method from configured options
6. Admin can add payment notes (optional)
7. Transaction is recorded with payment details
8. Points are awarded
9. Receipt/notification sent

## App Structure

### Customer App (`/customer`)
```
├── app/
│   ├── layout.tsx
│   ├── page.tsx (Home)
│   ├── services/
│   ├── rewards/
│   ├── account/
│   └── qr/
├── components/
│   ├── Navigation.tsx
│   ├── QRModal.tsx
│   ├── ServiceCard.tsx
│   └── RewardCard.tsx
└── hooks/
    ├── useAuth.ts
    ├── usePoints.ts
    └── useServices.ts
```

### Admin App (`/admin`)
```
├── app/
│   ├── layout.tsx
│   ├── page.tsx (Dashboard)
│   ├── scanner/
│   ├── customers/
│   ├── services/
│   ├── payment-methods/
│   ├── transactions/
│   └── reports/
├── components/
│   ├── Scanner.tsx
│   ├── CustomerInfo.tsx
│   ├── ServiceSelector.tsx
│   ├── PaymentMethodSelector.tsx
│   ├── PaymentMethodManager.tsx
│   └── TransactionForm.tsx
└── hooks/
    ├── useScanner.ts
    ├── useCustomers.ts
    ├── usePaymentMethods.ts
    └── useTransactions.ts
```

## Security Considerations

### Data Protection
- Input validation & sanitization
- SQL injection prevention (Supabase handles this)
- XSS protection

### QR Code Security
- Unique codes per user
- Validation on scan

### Prototype Notes
- No authentication system
- Fixed user/admin accounts
- Focus on core functionality

## Performance Optimizations

### Frontend
- Next.js Image optimization
- Static generation where possible
- Client-side caching with SWR/TanStack Query
- Lazy loading for components

### Database
- Proper indexing on frequently queried fields
- Connection pooling via Supabase
- Query optimization

### Real-time Features
- Supabase Realtime for live updates
- WebSocket connections for scanner
- Optimistic updates in UI

## Development Phases

### Phase 1: Core Setup (Week 1)
- [ ] Project setup with Next.js
- [ ] Supabase database setup
- [ ] Fixed accounts configuration
- [ ] Database schema implementation

### Phase 2: Customer App (Week 2)
- [ ] Home page with points display
- [ ] Services page (grid layout)
- [ ] QR code generation & modal
- [ ] Fixed customer profile

### Phase 3: Admin Core (Week 3)
- [ ] Admin dashboard
- [ ] QR scanner functionality
- [ ] Customer lookup via QR
- [ ] Service management

### Phase 4: Transaction System (Week 4)
- [ ] Transaction creation flow
- [ ] Points calculation & awarding
- [ ] Payment method selection
- [ ] Transaction history

### Phase 5: Advanced Features (Week 5)
- [ ] Rewards system
- [ ] Analytics & reporting
- [ ] Admin payment method management

### Phase 6: Polish & Deploy (Week 6)
- [ ] UI/UX refinements
- [ ] Testing & bug fixes
- [ ] Vercel deployment

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# App Config
NEXT_PUBLIC_APP_URL=your_app_url
JWT_SECRET=your_jwt_secret

# Optional: Third-party services
PUSHER_APP_ID=your_pusher_id (for notifications)
```

## Deployment Checklist

### Vercel Setup
- [ ] Connect GitHub repository
- [ ] Configure environment variables
- [ ] Set up custom domain
- [ ] Enable analytics

### Supabase Setup
- [ ] Create project
- [ ] Run database migrations
- [ ] Configure Row Level Security (RLS)
- [ ] Set up storage buckets

### Post-Deployment
- [ ] Test QR scanning functionality
- [ ] Verify point calculations
- [ ] Test transaction flow end-to-end
- [ ] Monitor performance & errors

## Monitoring & Analytics

### Error Tracking
- Vercel Analytics
- Custom error logging
- Supabase logs monitoring

### Performance Monitoring
- Core Web Vitals tracking
- Database query performance
- API response times

### Business Metrics
- Daily active users
- Transaction volume
- Points earned/redeemed
- Popular services

## Success Metrics

### Technical
- < 2s page load time
- 99.9% uptime
- < 100ms API response time

### Business
- User retention rate
- Average transaction value
- Points redemption rate
- Customer satisfaction score
