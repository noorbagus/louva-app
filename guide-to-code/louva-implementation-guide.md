# LOUVA Implementation Guide

## Phase 1: Setup (Day 1-2)

### 1.1 Project Setup
```bash
npx create-next-app@latest louva-app --typescript --tailwind --app
cd louva-app
npm install @supabase/supabase-js qrcode.js @zxing/library zustand
```

### 1.2 Supabase Setup
1. Create new Supabase project
2. Copy URL & anon key to `.env.local`
3. Run database schema (from project plan)
4. Insert fixed test data

### 1.3 Project Structure
```
src/
├── app/
│   ├── customer/
│   ├── admin/
│   └── api/
├── components/
├── lib/
└── hooks/
```

## Phase 2: Customer App (Day 3-4)

### 2.1 Basic Layout
- Create `/customer` route group
- Build bottom navigation component
- Implement screen routing

### 2.2 Core Pages
- **Home**: Points display + promo banner
- **Services**: Grid layout with categories
- **QR Modal**: Generate & display QR code
- **Account**: Profile + stats

### 2.3 Key Components
- `PointsDisplay.tsx`
- `ServiceGrid.tsx` 
- `QRModal.tsx`
- `BottomNav.tsx`

## Phase 3: Admin App (Day 5-6)

### 3.1 Admin Layout
- Create `/admin` route group
- Dashboard with stats
- Navigation system

### 3.2 Core Features
- **Scanner**: QR code scanning
- **Customer lookup**: Via QR
- **Service selection**: Multi-select
- **Payment method**: Dropdown

### 3.3 Key Components
- `QRScanner.tsx`
- `CustomerInfo.tsx`
- `ServiceSelector.tsx`
- `PaymentSelector.tsx`

## Phase 4: Transaction System (Day 7-8)

### 4.1 APIs
```typescript
// /api/scan/verify
POST { qrCode: string } → { customer: User }

// /api/transactions
POST { userId, services[], paymentMethodId } → { transaction }
```

### 4.2 Transaction Flow
1. Scan QR → Load customer
2. Select services → Calculate total
3. Choose payment → Create transaction
4. Update points → Show success

### 4.3 Points Logic
```typescript
const calculatePoints = (amount: number) => Math.floor(amount / 1000);
```

## Phase 5: Data & Polish (Day 9-10)

### 5.1 Sample Data
- Insert services (Hair Color, Cut, etc.)
- Add payment methods (Cash, QRIS, Cards)
- Create sample transactions

### 5.2 Real-time Updates
- Points update after transaction
- Admin dashboard refresh
- Transaction history sync

### 5.3 Error Handling
- QR scan failures
- Network errors
- Validation messages

## Phase 6: Deploy (Day 11-12)

### 6.1 Vercel Deployment
1. Push to GitHub
2. Connect Vercel project
3. Add environment variables
4. Deploy

### 6.2 Testing
- QR scan flow end-to-end
- Point calculation accuracy
- Payment recording
- Mobile responsiveness

## Key Files to Create

### Database
- `lib/supabase.ts` - Client setup
- `lib/database.types.ts` - TypeScript types

### Customer App
- `app/customer/page.tsx` - Home
- `app/customer/services/page.tsx` - Services grid
- `components/QRModal.tsx` - QR display

### Admin App
- `app/admin/page.tsx` - Dashboard
- `app/admin/scanner/page.tsx` - QR scanner
- `components/TransactionForm.tsx` - Transaction flow

### APIs
- `app/api/scan/verify/route.ts` - QR verification
- `app/api/transactions/route.ts` - Create transaction
- `app/api/user/[id]/route.ts` - User data

### Utils
- `lib/qr.ts` - QR generation/parsing
- `lib/points.ts` - Points calculations
- `hooks/useScanner.ts` - QR scanning logic

## Environment Variables
```env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
```

## Testing Checklist
- [ ] Customer app loads with Sari Dewi data
- [ ] QR code displays correctly
- [ ] Admin can scan QR and load customer
- [ ] Service selection works
- [ ] Payment methods populate
- [ ] Transaction creates and updates points
- [ ] Both apps are mobile responsive
