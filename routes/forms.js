const express = require('express');
const { body, validationResult } = require('express-validator');
const ContactForm = require('../models/ContactForm');
const ApplicationForm = require('../models/ApplicationForm');
const NewsletterSubscription = require('../models/NewsletterSubscription');
const emailService = require('../services/emailService');

const router = express.Router();

// Validation middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Get client IP and User Agent
const getClientInfo = (req) => ({
  ipAddress: req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'] || 'unknown',
  userAgent: req.headers['user-agent'] || 'unknown'
});

/**
 * POST /api/forms/contact
 * Submit contact form
 */
router.post('/contact', [
  body('firstName').trim().isLength({ min: 1, max: 50 }).withMessage('First name is required and must be less than 50 characters'),
  body('lastName').trim().isLength({ min: 1, max: 50 }).withMessage('Last name is required and must be less than 50 characters'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('phone').trim().isLength({ min: 1, max: 20 }).withMessage('Phone number is required and must be less than 20 characters'),
  body('country').trim().isLength({ min: 1, max: 50 }).withMessage('Country is required and must be less than 50 characters'),
  body('program').optional().trim().isLength({ max: 100 }).withMessage('Program name must be less than 100 characters'),
  body('message').trim().isLength({ min: 10, max: 1000 }).withMessage('Message is required and must be between 10 and 1000 characters'),
  handleValidationErrors
], async (req, res) => {
  try {
    console.log('📝 [FORM] Contact form submission received');
    console.log('📝 [FORM] Data:', JSON.stringify(req.body, null, 2));
    
    const clientInfo = getClientInfo(req);
    console.log('📝 [FORM] Client Info:', clientInfo);
    
    // Create contact form submission
    const contactForm = new ContactForm({
      ...req.body,
      ...clientInfo
    });

    const savedContact = await contactForm.save();
    console.log('✅ [FORM] Contact form saved to database:', savedContact._id);

    // Send emails
    try {
      console.log('📧 [FORM] Starting email sending process for contact form...');
      await Promise.all([
        emailService.sendContactFormConfirmation(savedContact),
        emailService.sendContactFormNotificationToAdmin(savedContact)
      ]);
      console.log('✅ [FORM] Both emails sent successfully (user + admin)');
    } catch (emailError) {
      console.error('❌ [FORM] Email sending failed:', emailError);
      console.error('❌ [FORM] Error details:', emailError.message);
      // Don't fail the request if email fails, just log it
    }

    res.status(201).json({
      success: true,
      message: 'Contact form submitted successfully! We will get back to you within 24 hours.',
      data: {
        id: savedContact._id,
        fullName: savedContact.fullName,
        email: savedContact.email
      }
    });

  } catch (error) {
    console.error('Contact form submission error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'A contact form with this email already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to submit contact form',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * POST /api/forms/application
 * Submit application form
 */
router.post('/application', [
  body('personalInfo.firstName').trim().isLength({ min: 1, max: 50 }).withMessage('First name is required'),
  body('personalInfo.lastName').trim().isLength({ min: 1, max: 50 }).withMessage('Last name is required'),
  body('personalInfo.email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('personalInfo.phone').trim().isLength({ min: 1, max: 20 }).withMessage('Phone number is required'),
  body('personalInfo.nationality').trim().isLength({ min: 1, max: 50 }).withMessage('Nationality is required'),
  body('personalInfo.dateOfBirth').isISO8601().withMessage('Valid date of birth is required'),
  body('academic.currentEducation').trim().isLength({ min: 1, max: 100 }).withMessage('Current education level is required'),
  body('academic.institution').optional().trim().isLength({ max: 200 }).withMessage('Institution name too long'),
  body('academic.gpa').optional().trim().isLength({ max: 10 }).withMessage('GPA format invalid'),
  body('academic.graduationYear').optional().trim().isLength({ max: 4 }).withMessage('Graduation year invalid'),
  body('academic.fieldOfStudy').optional().trim().isLength({ max: 100 }).withMessage('Field of study too long'),
  body('program.country').isIn(['china', 'hungary', 'italy']).withMessage('Valid country selection is required'),
  body('program.degreeLevel').isIn(['bachelor', 'bachelors', 'master', 'masters', 'phd', 'mbbs', 'diploma', 'certificate']).withMessage('Valid degree level is required'),
  body('program.preferredProgram').trim().isLength({ min: 1, max: 100 }).withMessage('Preferred program is required'),
  body('program.preferredUniversity').optional().trim().isLength({ max: 200 }).withMessage('University name too long'),
  body('program.startDate').optional().trim().isLength({ max: 100 }).withMessage('Start date too long'),
  body('documents.transcript').optional().isBoolean().withMessage('Transcript must be boolean'),
  body('documents.passport').optional().isBoolean().withMessage('Passport must be boolean'),
  body('documents.languageTest').optional().isBoolean().withMessage('Language test must be boolean'),
  body('documents.recommendation').optional().isBoolean().withMessage('Recommendation must be boolean'),
  body('additional.scholarshipInterest').optional().isIn(['full', 'partial', 'any', 'none']).withMessage('Invalid scholarship interest'),
  body('additional.personalStatement').optional().trim().isLength({ max: 2000 }).withMessage('Personal statement too long'),
  body('additional.previousExperience').optional().trim().isLength({ max: 1000 }).withMessage('Previous experience too long'),
  handleValidationErrors
], async (req, res) => {
  try {
    console.log('📝 [FORM] Application form submission received');
    console.log('📝 [FORM] Data:', JSON.stringify(req.body, null, 2));
    
    const clientInfo = getClientInfo(req);
    console.log('📝 [FORM] Client Info:', clientInfo);
    
    // Create application form submission
    const applicationForm = new ApplicationForm({
      ...req.body,
      ...clientInfo
    });

    const savedApplication = await applicationForm.save();
    console.log('✅ [FORM] Application form saved to database:', savedApplication._id);
    console.log('📝 [FORM] Applicant:', `${savedApplication.personalInfo.firstName} ${savedApplication.personalInfo.lastName}`);
    console.log('📝 [FORM] Program:', savedApplication.program.preferredProgram);

    // Send emails
    try {
      console.log('📧 [FORM] Starting email sending process for application form...');
      await Promise.all([
        emailService.sendApplicationFormConfirmation(savedApplication),
        emailService.sendApplicationFormNotificationToAdmin(savedApplication)
      ]);
      console.log('✅ [FORM] Both emails sent successfully (user + admin)');
    } catch (emailError) {
      console.error('❌ [FORM] Email sending failed:', emailError);
      console.error('❌ [FORM] Error details:', emailError.message);
      // Don't fail the request if email fails, just log it
    }

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully! We will review your application and get back to you within 2 weeks.',
      data: {
        id: savedApplication._id,
        fullName: savedApplication.fullName,
        email: savedApplication.personalInfo.email,
        program: savedApplication.program.preferredProgram,
        degreeLevel: savedApplication.program.degreeLevel
      }
    });

  } catch (error) {
    console.error('Application form submission error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'An application with this email already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to submit application',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * POST /api/forms/newsletter
 * Subscribe to newsletter
 */
router.post('/newsletter', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('source').optional().isIn(['homepage', 'contact_page', 'apply_page', 'other']).withMessage('Invalid source'),
  handleValidationErrors
], async (req, res) => {
  try {
    console.log('📝 [FORM] Newsletter subscription received');
    console.log('📝 [FORM] Email:', req.body.email);
    console.log('📝 [FORM] Source:', req.body.source || 'homepage');
    
    const clientInfo = getClientInfo(req);
    const { email, source = 'homepage' } = req.body;

    // Check if email already exists
    const existingSubscription = await NewsletterSubscription.findByEmail(email);
    
    if (existingSubscription) {
      if (existingSubscription.status === 'active') {
        console.log('ℹ️ [FORM] Email already subscribed:', email);
        return res.status(200).json({
          success: true,
          message: 'You are already subscribed to our newsletter!',
          data: { email, status: 'already_subscribed' }
        });
      } else if (existingSubscription.status === 'unsubscribed') {
        console.log('🔄 [FORM] Reactivating subscription for:', email);
        // Reactivate subscription
        existingSubscription.status = 'active';
        existingSubscription.source = source;
        existingSubscription.unsubscribedAt = undefined;
        existingSubscription.lastEmailSent = new Date();
        const reactivatedSubscription = await existingSubscription.save();

        // Send confirmation email
        try {
          console.log('📧 [FORM] Sending reactivation emails...');
          await Promise.all([
            emailService.sendNewsletterConfirmation(email),
            emailService.sendNewsletterNotificationToAdmin(reactivatedSubscription)
          ]);
          console.log('✅ [FORM] Reactivation emails sent successfully');
        } catch (emailError) {
          console.error('❌ [FORM] Email sending failed:', emailError);
        }

        return res.status(200).json({
          success: true,
          message: 'Welcome back! You have been resubscribed to our newsletter.',
          data: { email, status: 'resubscribed' }
        });
      }
    }

    // Create new subscription
    console.log('📝 [FORM] Creating new newsletter subscription');
    const newsletterSubscription = new NewsletterSubscription({
      email,
      source,
      ...clientInfo,
      lastEmailSent: new Date()
    });

    const savedSubscription = await newsletterSubscription.save();
    console.log('✅ [FORM] Newsletter subscription saved to database:', savedSubscription._id);

    // Send emails to both user and admin
    try {
      console.log('📧 [FORM] Starting email sending process for newsletter subscription...');
      await Promise.all([
        emailService.sendNewsletterConfirmation(email),
        emailService.sendNewsletterNotificationToAdmin(savedSubscription)
      ]);
      console.log('✅ [FORM] Both emails sent successfully (user + admin)');
    } catch (emailError) {
      console.error('❌ [FORM] Email sending failed:', emailError);
      console.error('❌ [FORM] Error details:', emailError.message);
      // Don't fail the request if email fails, just log it
    }

    res.status(201).json({
      success: true,
      message: 'Successfully subscribed to our newsletter! Check your email for confirmation.',
      data: {
        email,
        status: 'subscribed'
      }
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'This email is already subscribed'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to subscribe to newsletter',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

/**
 * POST /api/forms/newsletter/unsubscribe
 * Unsubscribe from newsletter
 */
router.post('/newsletter/unsubscribe', [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  handleValidationErrors
], async (req, res) => {
  try {
    const { email } = req.body;
    
    const subscription = await NewsletterSubscription.findByEmail(email);
    
    if (!subscription) {
      return res.status(404).json({
        success: false,
        message: 'Email not found in our newsletter subscription list'
      });
    }

    if (subscription.status === 'unsubscribed') {
      return res.status(200).json({
        success: true,
        message: 'You are already unsubscribed from our newsletter'
      });
    }

    await subscription.unsubscribe();

    res.status(200).json({
      success: true,
      message: 'You have been successfully unsubscribed from our newsletter'
    });

  } catch (error) {
    console.error('Newsletter unsubscribe error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to unsubscribe from newsletter',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router;

