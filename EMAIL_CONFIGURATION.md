# Email Configuration Guide

## Overview
This application sends emails to both users and admins when forms are submitted. All emails are sent using Brevo (formerly Sendinblue).

## When to Change Frontend URL

### Development
- **Backend `.env`**: Set `FRONTEND_URL=http://localhost:3000` (default Next.js dev server)
- **Frontend `.env.local`**: Set `NEXT_PUBLIC_API_URL=http://localhost:5000/api` (default backend server)

### Production
- **Backend `.env`**: Set `FRONTEND_URL=https://yourdomain.com` (your actual frontend domain)
- **Frontend `.env.local`**: Set `NEXT_PUBLIC_API_URL=https://api.yourdomain.com/api` (your actual backend API URL)

### Important Notes
1. **CORS Configuration**: The backend uses `FRONTEND_URL` for CORS settings. Make sure it matches your actual frontend URL.
2. **Frontend URL changes needed when**:
   - Deploying to production
   - Changing domain/subdomain
   - Using a different port in development
   - Switching between local and staging environments

## Required Environment Variables

### Backend `.env` file
```env
# Database
MONGODB_URI=mongodb://localhost:27017/next-stop-china

# Email Service (Brevo)
BREVO_API_KEY=your_brevo_api_key_here
FROM_EMAIL=noreply@yourdomain.com
ADMIN_EMAIL=admin@yourdomain.com

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Server
PORT=5000
NODE_ENV=development

# Rate Limiting (optional)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend `.env.local` file
```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# Site URL (for share links, etc.)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## Email Configuration

### Email Service Setup
1. Create a Brevo account at https://www.brevo.com
2. Get your API key from Brevo dashboard
3. Verify your sender email address in Brevo
4. Add the API key to `BREVO_API_KEY` in backend `.env`
5. Set `FROM_EMAIL` to your verified sender email
6. Set `ADMIN_EMAIL` to the email address that should receive notifications

### Email Types
The system sends the following emails:

1. **Contact Form**:
   - User confirmation email
   - Admin notification email

2. **Application Form**:
   - User confirmation email
   - Admin notification email

3. **Newsletter Subscription**:
   - User welcome email
   - Admin notification email

## Console Logging

The email service includes detailed console logging for debugging:

- `📧 [EMAIL]` - Email preparation and sending
- `✅ [EMAIL]` - Successful email operations
- `❌ [EMAIL]` - Email errors
- `📝 [FORM]` - Form submission logging

### Viewing Logs
Check your backend server console to see:
- When emails are being prepared
- Recipient email addresses
- Success/failure status
- Brevo API responses
- Error details if sending fails

## Troubleshooting

### Emails Not Sending
1. Check that `BREVO_API_KEY` is set correctly
2. Verify the sender email is verified in Brevo
3. Check console logs for error messages
4. Ensure `FROM_EMAIL` matches a verified sender in Brevo
5. Verify `ADMIN_EMAIL` is a valid email address

### CORS Errors
1. Ensure `FRONTEND_URL` in backend `.env` matches your frontend URL
2. Check that the frontend is making requests to the correct backend URL
3. Restart the backend server after changing `FRONTEND_URL`

### Database Errors
1. Ensure MongoDB is running
2. Check `MONGODB_URI` is correct
3. Verify database connection in console logs

## Testing

To test email functionality:
1. Submit a contact form
2. Submit an application form
3. Subscribe to newsletter
4. Check console logs for email sending status
5. Verify emails are received in both user and admin inboxes


