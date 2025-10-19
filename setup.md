# Backend Setup Guide

This guide will help you set up the Next Stop China backend API with MongoDB and Brevo email service.

## Prerequisites

- Node.js (version 18 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- Brevo (formerly SendinBlue) account

## Step 1: Install Dependencies

```bash
cd backend
npm install
```

## Step 2: Set up Environment Variables

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Edit the `.env` file with your configuration:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/next-stop-china
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/next-stop-china

# Server
PORT=5000
NODE_ENV=development

# Brevo Email Configuration
BREVO_API_KEY=your_brevo_api_key_here
ADMIN_EMAIL=admin@nextstopchina.com
FROM_EMAIL=noreply@nextstopchina.com

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Step 3: Set up MongoDB

### Option A: Local MongoDB
1. Install MongoDB locally
2. Start MongoDB service
3. The default connection string `mongodb://localhost:27017/next-stop-china` should work

### Option B: MongoDB Atlas (Recommended)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Get your connection string
5. Replace `MONGODB_URI` in `.env` with your Atlas connection string

## Step 4: Set up Brevo Email Service

1. Go to [Brevo](https://www.brevo.com/) (formerly SendinBlue)
2. Create a free account
3. Go to Settings > API Keys
4. Generate a new API key
5. Copy the API key and paste it in your `.env` file as `BREVO_API_KEY`

### Brevo Configuration
- **Admin Email**: The email address where form notifications will be sent
- **From Email**: The email address that will appear as the sender (must be verified in Brevo)
- **Sender Name**: Will appear as "Next Stop China" in emails

## Step 5: Start the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on `http://localhost:5000` (or the port specified in your `.env` file).

## Step 6: Test the API

Run the test script to verify everything is working:

```bash
node test/api-test.js
```

This will test all endpoints and email functionality.

## Step 7: Frontend Integration

1. Make sure your frontend is running on `http://localhost:3000`
2. The frontend forms are already configured to connect to the backend
3. Test the forms:
   - Contact form at `/contact`
   - Application form at `/apply`
   - Newsletter subscription on the homepage

## API Endpoints

- `POST /api/forms/contact` - Submit contact form
- `POST /api/forms/application` - Submit application form
- `POST /api/forms/newsletter` - Subscribe to newsletter
- `POST /api/forms/newsletter/unsubscribe` - Unsubscribe from newsletter
- `GET /api/health` - Health check
- `GET /api/email/test` - Test email service (development only)

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Check if MongoDB is running
   - Verify the connection string in `.env`
   - Check firewall settings

2. **Email Sending Fails**
   - Verify Brevo API key is correct
   - Check if the "from" email is verified in Brevo
   - Check Brevo account limits

3. **CORS Errors**
   - Make sure `FRONTEND_URL` in `.env` matches your frontend URL
   - Check if both frontend and backend are running

4. **Rate Limiting**
   - Adjust `RATE_LIMIT_MAX_REQUESTS` and `RATE_LIMIT_WINDOW_MS` in `.env`
   - Default is 100 requests per 15 minutes

### Logs

Check the console output for detailed error messages. In development mode, full error details are shown.

## Production Deployment

1. Set `NODE_ENV=production` in your `.env` file
2. Use a production MongoDB instance
3. Set up proper logging and monitoring
4. Configure reverse proxy (nginx) if needed
5. Set up SSL certificates
6. Use environment variables for sensitive data

## Security Considerations

- Never commit `.env` files to version control
- Use strong passwords for database connections
- Regularly rotate API keys
- Monitor rate limiting and adjust as needed
- Keep dependencies updated

## Support

If you encounter issues:
1. Check the console logs for error messages
2. Verify all environment variables are set correctly
3. Test individual components (database, email service)
4. Check the API documentation in `README.md`

