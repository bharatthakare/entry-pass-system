# Student Entry Pass System

A complete production-ready digital entry pass system built with Next.js, Supabase, and modern web technologies.

## ✨ Features

- **Digital Pass Generation**: Students can generate QR-coded entry passes
- **QR Code Verification**: Real-time pass verification via QR scan
- **Admin Panel**: Secure admin interface for student management
- **Mobile Responsive**: Works seamlessly on all devices
- **Real-time Logging**: Track pass generation and verification
- **Secure Architecture**: HMAC signatures and Supabase RLS

## 🚀 Tech Stack

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: Supabase (PostgreSQL + Auth + Edge Functions)
- **QR Codes**: qrcode.react
- **Export**: html2canvas
- **Deployment**: Vercel + Supabase

## 📋 Prerequisites

1. **Supabase Account**: [Create account](https://supabase.com)
2. **Node.js**: Version 18+ installed
3. **Git**: For version control

## ⚡ Quick Setup

### 1. Clone and Install
```bash
git clone <your-repo>
cd student-pass-system
npm install
```

### 2. Supabase Setup
1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **Settings** > **API** and copy:
   - Project URL
   - Anon public key

### 3. Environment Variables
```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
NEXT_PUBLIC_PASS_SECRET=your-super-secret-key
```

### 4. Database Setup
Run the SQL migration in your Supabase SQL Editor:
```sql
-- Copy the entire content from supabase/migrations/create_students_schema.sql
```

### 5. Deploy Edge Function
```bash
# Install Supabase CLI
npm i -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your-project-ref

# Deploy the verify function
supabase functions deploy verify
```

### 6. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` 🎉

## 🎯 Usage Guide

### For Students
1. Visit the website
2. Enter your **name** and **class**
3. Click "Generate Pass"
4. Download/save your digital pass
5. Present QR code at event entrance

### For Admins
1. Click "Admin Panel" button
2. Login with credentials (default: admin/admin123)
3. Add new students to the system
4. View dashboard with statistics and logs

### For Event Staff
1. Scan QR code with any QR scanner
2. Visit the verification URL
3. See instant verification status
4. Allow/deny entry based on result

## 🔒 Security Features

- **HMAC Signatures**: All QR codes use cryptographic signatures
- **Row Level Security**: Database access controlled via Supabase RLS
- **Pass Revocation**: Ability to invalidate passes
- **Activity Logging**: All actions are logged with timestamps
- **IP Tracking**: Monitor verification attempts

## 🎨 Customization

### Styling
- Modify `tailwind.config.ts` for theme changes
- Update gradient colors in components
- Customize pass card design in `PassCard.tsx`

### Branding
- Replace logo in pass card component
- Update college name and event details
- Modify colors and typography

### Database Schema
- Add custom fields to students table
- Create additional tracking tables
- Implement advanced analytics

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repo to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

### Backend (Supabase)
1. Database and Edge Functions auto-deploy
2. Configure custom domain if needed
3. Set up monitoring and backups

## 📊 Monitoring

### Built-in Analytics
- Student registration count
- Pass generation metrics
- Verification success rates
- Real-time activity logs

### Advanced Monitoring
- Set up Supabase monitoring
- Configure alerts for suspicious activity
- Track performance metrics

## 🔧 Configuration

### Admin Credentials
```typescript
// lib/auth.ts
export const ADMIN_CREDENTIALS = {
  username: 'your-admin',
  password: 'secure-password'
};
```

### Event Details
```typescript
// Update in components/PassCard.tsx
const EVENT_DATE = "30 Sept 2025";
const EVENT_NAME = "Annual College Event";
```

### QR Code Settings
```typescript
// components/PassCard.tsx
<QRCode
  value={verificationUrl}
  size={120}
  level="M" // Error correction level
  includeMargin={false}
/>
```

## 🛡️ Production Checklist

- [ ] Change default admin credentials
- [ ] Use strong HMAC secret key
- [ ] Enable Supabase 2FA
- [ ] Set up database backups
- [ ] Configure rate limiting
- [ ] Add error monitoring (Sentry)
- [ ] Test on multiple devices
- [ ] Security audit QR scanning flow
- [ ] Set up SSL certificates
- [ ] Configure CORS properly

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License - see LICENSE file for details.

## 🆘 Support

### Common Issues

**Database Connection Issues**
- Verify Supabase URL and keys
- Check RLS policies are enabled
- Ensure migrations ran successfully

**QR Code Not Working**
- Verify edge function is deployed
- Check CORS settings
- Validate HMAC signature generation

**Pass Generation Failing**
- Check student exists in database
- Verify form validation
- Monitor browser console for errors

### Get Help
- Create GitHub issue for bugs
- Check Supabase documentation
- Review Next.js troubleshooting guide

---

**Made with ❤️ for secure event management**