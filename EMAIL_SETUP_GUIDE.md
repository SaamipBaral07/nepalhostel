# Email Verification Setup Guide

## ✅ Changes Made - Now Production Ready!

### 1. Email Backend Configuration
- **Updated**: `.env.local` - Changed `EMAIL_BACKEND` from `console` to `smtp`
- **Created**: `backend/.env` - Added production SMTP configuration
- **Updated**: `.env.example` - Added documentation for email settings

### 2. Professional HTML Email Templates
Enhanced both OTP verification and password reset emails with:
- Professional HTML templates with responsive design
- Branded header with gradient background (Hostel Nepal colors)
- Clear call-to-action buttons
- Security notices and warnings
- Plain text fallback for email clients that don't support HTML
- Better error handling with logging

### 3. Error Handling
- Added try-catch blocks for email sending
- Logging for debugging email issues
- User-friendly error messages

## 🚀 Quick Start

### Step 1: Verify Gmail App Password

Your current configuration uses Gmail SMTP. Make sure you have an **App Password** (not your regular Gmail password):

1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable **2-Step Verification** (if not already enabled)
3. Go to [App Passwords](https://myaccount.google.com/apppasswords)
4. Generate a new app password for "Mail"
5. Copy the 16-character password
6. Update `EMAIL_HOST_PASSWORD` in `.env.local` and `backend/.env`

### Step 2: Test Email Configuration

Run the test script to verify emails are sending:

```bash
cd backend
python test_email.py
```

Enter your email address when prompted. You should receive a test email within seconds.

### Step 3: Restart Django Server

```bash
cd backend
python manage.py runserver
```

### Step 4: Test Registration Flow

1. Go to `http://localhost:3000/register`
2. Enter your email address
3. Click "Send OTP"
4. **Check your email inbox** (and spam folder if needed)
5. You should receive a professional email with a 6-digit code
6. Enter the code and complete registration

## Testing the Email System

### Prerequisites
Make sure your Gmail account has "App Passwords" enabled:
1. Go to Google Account settings
2. Enable 2-Factor Authentication
3. Generate an App Password for "Mail"
4. Use that password in `EMAIL_HOST_PASSWORD`

### Test OTP Email Verification

1. **Restart Django server** (to load new environment variables):
   ```bash
   cd backend
   python manage.py runserver
   ```

2. **Test registration flow**:
   - Go to `http://localhost:3000/register`
   - Enter your email address
   - Click "Send OTP"
   - Check your email inbox (and spam folder)
   - You should receive a professional HTML email with a 6-digit code
   - Enter the code and verify
   - Complete registration

3. **Test password reset**:
   - Go to `http://localhost:3000/forgot-password`
   - Enter your email
   - Check your inbox for the reset link email

## 📧 Email System Features

### OTP Verification Email
- ✅ Professional HTML design with Hostel Nepal branding
- ✅ Large, easy-to-read 6-digit OTP code
- ✅ Expiration time (10 minutes) clearly stated
- ✅ Security notice included
- ✅ Plain text fallback for all email clients
- ✅ Mobile-responsive design

### Password Reset Email
- ✅ Professional HTML design
- ✅ Prominent "Reset My Password" button
- ✅ Fallback URL for manual copy-paste
- ✅ 24-hour expiration notice
- ✅ Security notice included
- ✅ Plain text fallback

### Security Features (Industry Standard)
- ✅ OTP expires in 10 minutes
- ✅ 90-second cooldown between resend requests
- ✅ Max 5 verification attempts per OTP
- ✅ Max 10 OTPs per day per email (prevents abuse)
- ✅ HMAC-SHA256 based OTP hashing (secure storage)
- ✅ Email enumeration prevention on password reset
- ✅ Rate limiting to prevent spam
- ✅ Automatic cleanup of verified emails after registration

## 🔧 Troubleshooting

### Emails not sending?
1. Check Gmail App Password is correct
2. Verify 2FA is enabled on Gmail account
3. Check Django logs for SMTP errors
4. Ensure `EMAIL_BACKEND` is set to `smtp` (not `console`)

### Emails going to spam?
- This is common with Gmail SMTP for development
- Add sender to contacts
- Consider using a dedicated email service (SendGrid, AWS SES) for production

### Rate limiting?
- Gmail has sending limits (500/day for free accounts)
- For production, use a transactional email service

## Production Recommendations

For a production deployment, consider:
1. **Use a dedicated email service**: SendGrid, AWS SES, Mailgun, or Postmark
2. **Add email templates**: Store templates in Django templates directory
3. **Add email logging**: Track sent emails in database
4. **Monitor deliverability**: Track bounce rates and spam reports
5. **Add unsubscribe links**: For marketing emails (not required for transactional)
6. **Use environment-specific FROM addresses**: Different for dev/staging/prod
