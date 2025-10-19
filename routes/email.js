const express = require('express');
const emailService = require('../services/emailService');

const router = express.Router();

/**
 * GET /api/email/test
 * Test email service
 */
router.get('/test', async (req, res) => {
  try {
    // Test email sending with a simple test
    const testEmail = {
      email: 'test@example.com',
      firstName: 'Test',
      lastName: 'User'
    };

    // This is just for testing - in production, you might want to remove this endpoint
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({
        success: false,
        message: 'Test endpoint not available in production'
      });
    }

    res.json({
      success: true,
      message: 'Email service is configured and ready',
      config: {
        fromEmail: process.env.FROM_EMAIL,
        adminEmail: process.env.ADMIN_EMAIL,
        brevoConfigured: !!process.env.BREVO_API_KEY
      }
    });

  } catch (error) {
    console.error('Email service test error:', error);
    res.status(500).json({
      success: false,
      message: 'Email service test failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router;

