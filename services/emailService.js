const brevo = require('@getbrevo/brevo');

// Initialize Brevo client
const defaultClient = brevo.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

// Validate that BREVO_API_KEY is set
if (!process.env.BREVO_API_KEY) {
  console.warn('⚠️  WARNING: BREVO_API_KEY is not set in environment variables. Email functionality will not work.');
}

const apiInstance = new brevo.TransactionalEmailsApi();

class EmailService {
  constructor() {
    this.fromEmail = process.env.FROM_EMAIL || 'noreply@nextstopchina.com';
    this.adminEmail = process.env.ADMIN_EMAIL || 'admin@nextstopchina.com';
    
    // Check if email service is properly configured
    console.log('📧 [EMAIL SERVICE] Initializing email service...');
    console.log('📧 [EMAIL SERVICE] Configuration:');
    console.log(`   From Email: ${this.fromEmail}`);
    console.log(`   Admin Email: ${this.adminEmail}`);
    console.log(`   BREVO_API_KEY: ${process.env.BREVO_API_KEY ? '✅ Set' : '❌ Missing'}`);
    
    if (!process.env.BREVO_API_KEY) {
      console.warn('⚠️  [EMAIL SERVICE] BREVO_API_KEY is missing. Emails will fail to send.');
      console.warn('⚠️  [EMAIL SERVICE] Please set BREVO_API_KEY in your .env file.');
    } else {
      console.log('✅ [EMAIL SERVICE] Email service configured successfully');
      console.log('✅ [EMAIL SERVICE] Ready to send emails to users and admins');
    }
  }

  /**
   * Send contact form confirmation email to user
   */
  async sendContactFormConfirmation(contactData) {
    try {
      console.log('📧 [EMAIL] Preparing to send contact form confirmation email...');
      console.log('📧 [EMAIL] To:', contactData.email);
      console.log('📧 [EMAIL] From:', this.fromEmail);
      console.log('📧 [EMAIL] Recipient Name:', `${contactData.firstName} ${contactData.lastName}`);
      
      const sendSmtpEmail = new brevo.SendSmtpEmail();
      
      sendSmtpEmail.subject = 'Thank you for contacting Next Stop China!';
      sendSmtpEmail.htmlContent = this.getContactFormConfirmationTemplate(contactData);
      sendSmtpEmail.sender = { name: 'Next Stop China', email: this.fromEmail };
      sendSmtpEmail.to = [{ email: contactData.email, name: `${contactData.firstName} ${contactData.lastName}` }];

      console.log('📧 [EMAIL] Sending contact form confirmation email via Brevo...');
      const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
      console.log('✅ [EMAIL] Contact form confirmation email sent successfully!');
      console.log('📧 [EMAIL] Brevo Response:', JSON.stringify(result, null, 2));
      return result;
    } catch (error) {
      console.error('❌ [EMAIL] Error sending contact form confirmation email:', error);
      console.error('❌ [EMAIL] Error details:', error.message);
      if (error.response) {
        console.error('❌ [EMAIL] Error response:', JSON.stringify(error.response.body, null, 2));
      }
      throw error;
    }
  }

  /**
   * Send contact form notification email to admin
   */
  async sendContactFormNotificationToAdmin(contactData) {
    try {
      console.log('📧 [EMAIL] Preparing to send contact form notification to admin...');
      console.log('📧 [EMAIL] To Admin:', this.adminEmail);
      console.log('📧 [EMAIL] From:', this.fromEmail);
      console.log('📧 [EMAIL] Submission From:', `${contactData.firstName} ${contactData.lastName} (${contactData.email})`);
      
      const sendSmtpEmail = new brevo.SendSmtpEmail();
      
      sendSmtpEmail.subject = `New Contact Form Submission - ${contactData.firstName} ${contactData.lastName}`;
      sendSmtpEmail.htmlContent = this.getContactFormAdminTemplate(contactData);
      sendSmtpEmail.sender = { name: 'Next Stop China', email: this.fromEmail };
      sendSmtpEmail.to = [{ email: this.adminEmail, name: 'Admin' }];

      console.log('📧 [EMAIL] Sending contact form notification email to admin via Brevo...');
      const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
      console.log('✅ [EMAIL] Contact form notification email sent to admin successfully!');
      console.log('📧 [EMAIL] Brevo Response:', JSON.stringify(result, null, 2));
      return result;
    } catch (error) {
      console.error('❌ [EMAIL] Error sending contact form notification to admin:', error);
      console.error('❌ [EMAIL] Error details:', error.message);
      if (error.response) {
        console.error('❌ [EMAIL] Error response:', JSON.stringify(error.response.body, null, 2));
      }
      throw error;
    }
  }

  /**
   * Send application form confirmation email to user
   */
  async sendApplicationFormConfirmation(applicationData) {
    try {
      console.log('📧 [EMAIL] Preparing to send application form confirmation email...');
      console.log('📧 [EMAIL] To:', applicationData.personalInfo.email);
      console.log('📧 [EMAIL] From:', this.fromEmail);
      console.log('📧 [EMAIL] Recipient Name:', `${applicationData.personalInfo.firstName} ${applicationData.personalInfo.lastName}`);
      console.log('📧 [EMAIL] Program:', applicationData.program.preferredProgram);
      
      const sendSmtpEmail = new brevo.SendSmtpEmail();
      
      sendSmtpEmail.subject = 'Application Received - Next Stop China';
      sendSmtpEmail.htmlContent = this.getApplicationFormConfirmationTemplate(applicationData);
      sendSmtpEmail.sender = { name: 'Next Stop China', email: this.fromEmail };
      sendSmtpEmail.to = [{ email: applicationData.personalInfo.email, name: `${applicationData.personalInfo.firstName} ${applicationData.personalInfo.lastName}` }];

      console.log('📧 [EMAIL] Sending application form confirmation email via Brevo...');
      const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
      console.log('✅ [EMAIL] Application form confirmation email sent successfully!');
      console.log('📧 [EMAIL] Brevo Response:', JSON.stringify(result, null, 2));
      return result;
    } catch (error) {
      console.error('❌ [EMAIL] Error sending application form confirmation email:', error);
      console.error('❌ [EMAIL] Error details:', error.message);
      if (error.response) {
        console.error('❌ [EMAIL] Error response:', JSON.stringify(error.response.body, null, 2));
      }
      throw error;
    }
  }

  /**
   * Send application form notification email to admin
   */
  async sendApplicationFormNotificationToAdmin(applicationData) {
    try {
      console.log('📧 [EMAIL] Preparing to send application form notification to admin...');
      console.log('📧 [EMAIL] To Admin:', this.adminEmail);
      console.log('📧 [EMAIL] From:', this.fromEmail);
      console.log('📧 [EMAIL] Application From:', `${applicationData.personalInfo.firstName} ${applicationData.personalInfo.lastName} (${applicationData.personalInfo.email})`);
      console.log('📧 [EMAIL] Program:', applicationData.program.preferredProgram);
      console.log('📧 [EMAIL] Degree Level:', applicationData.program.degreeLevel);
      
      const sendSmtpEmail = new brevo.SendSmtpEmail();
      
      sendSmtpEmail.subject = `New Application Submission - ${applicationData.personalInfo.firstName} ${applicationData.personalInfo.lastName}`;
      sendSmtpEmail.htmlContent = this.getApplicationFormAdminTemplate(applicationData);
      sendSmtpEmail.sender = { name: 'Next Stop China', email: this.fromEmail };
      sendSmtpEmail.to = [{ email: this.adminEmail, name: 'Admin' }];

      console.log('📧 [EMAIL] Sending application form notification email to admin via Brevo...');
      const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
      console.log('✅ [EMAIL] Application form notification email sent to admin successfully!');
      console.log('📧 [EMAIL] Brevo Response:', JSON.stringify(result, null, 2));
      return result;
    } catch (error) {
      console.error('❌ [EMAIL] Error sending application form notification to admin:', error);
      console.error('❌ [EMAIL] Error details:', error.message);
      if (error.response) {
        console.error('❌ [EMAIL] Error response:', JSON.stringify(error.response.body, null, 2));
      }
      throw error;
    }
  }

  /**
   * Send newsletter subscription confirmation email
   */
  async sendNewsletterConfirmation(email) {
    try {
      console.log('📧 [EMAIL] Preparing to send newsletter confirmation email...');
      console.log('📧 [EMAIL] To:', email);
      console.log('📧 [EMAIL] From:', this.fromEmail);
      
      const sendSmtpEmail = new brevo.SendSmtpEmail();
      
      sendSmtpEmail.subject = 'Welcome to Next Stop China Newsletter!';
      sendSmtpEmail.htmlContent = this.getNewsletterConfirmationTemplate();
      sendSmtpEmail.sender = { name: 'Next Stop China', email: this.fromEmail };
      sendSmtpEmail.to = [{ email: email, name: 'Subscriber' }];

      console.log('📧 [EMAIL] Sending newsletter confirmation email via Brevo...');
      const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
      console.log('✅ [EMAIL] Newsletter confirmation email sent successfully!');
      console.log('📧 [EMAIL] Brevo Response:', JSON.stringify(result, null, 2));
      return result;
    } catch (error) {
      console.error('❌ [EMAIL] Error sending newsletter confirmation email:', error);
      console.error('❌ [EMAIL] Error details:', error.message);
      if (error.response) {
        console.error('❌ [EMAIL] Error response:', JSON.stringify(error.response.body, null, 2));
      }
      throw error;
    }
  }

  /**
   * Send newsletter subscription notification email to admin
   */
  async sendNewsletterNotificationToAdmin(subscriptionData) {
    try {
      console.log('📧 [EMAIL] Preparing to send newsletter notification to admin...');
      console.log('📧 [EMAIL] To Admin:', this.adminEmail);
      console.log('📧 [EMAIL] From:', this.fromEmail);
      console.log('📧 [EMAIL] New Subscriber:', subscriptionData.email);
      console.log('📧 [EMAIL] Source:', subscriptionData.source || 'homepage');
      
      const sendSmtpEmail = new brevo.SendSmtpEmail();
      
      sendSmtpEmail.subject = `New Newsletter Subscription - ${subscriptionData.email}`;
      sendSmtpEmail.htmlContent = this.getNewsletterAdminTemplate(subscriptionData);
      sendSmtpEmail.sender = { name: 'Next Stop China', email: this.fromEmail };
      sendSmtpEmail.to = [{ email: this.adminEmail, name: 'Admin' }];

      console.log('📧 [EMAIL] Sending newsletter notification email to admin via Brevo...');
      const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
      console.log('✅ [EMAIL] Newsletter notification email sent to admin successfully!');
      console.log('📧 [EMAIL] Brevo Response:', JSON.stringify(result, null, 2));
      return result;
    } catch (error) {
      console.error('❌ [EMAIL] Error sending newsletter notification to admin:', error);
      console.error('❌ [EMAIL] Error details:', error.message);
      if (error.response) {
        console.error('❌ [EMAIL] Error response:', JSON.stringify(error.response.body, null, 2));
      }
      throw error;
    }
  }

  /**
   * Contact form confirmation email template
   */
  getContactFormConfirmationTemplate(contactData) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Thank you for contacting us!</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .highlight { background: #e8f4fd; padding: 15px; border-left: 4px solid #667eea; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Thank You for Contacting Next Stop China!</h1>
        </div>
        <div class="content">
          <p>Dear ${contactData.firstName},</p>
          
          <p>Thank you for reaching out to us! We have received your message and our team will get back to you within 24 hours.</p>
          
          <div class="highlight">
            <strong>Your Message Summary:</strong><br>
            <strong>Name:</strong> ${contactData.firstName} ${contactData.lastName}<br>
            <strong>Email:</strong> ${contactData.email}<br>
            <strong>Phone:</strong> ${contactData.phone}<br>
            <strong>Country:</strong> ${contactData.country}<br>
            <strong>Interested Program:</strong> ${contactData.program || 'Not specified'}<br>
            <strong>Message:</strong> ${contactData.message}
          </div>
          
          <p>In the meantime, feel free to explore our website to learn more about:</p>
          <ul>
            <li>Available scholarships and programs</li>
            <li>Chinese universities and their requirements</li>
            <li>Visa application process</li>
            <li>Student success stories</li>
          </ul>
          
          <p>If you have any urgent questions, you can also reach us at:</p>
          <ul>
            <li>Phone: +1 (555) 123-4567</li>
            <li>WhatsApp: +1 (555) 123-4567</li>
            <li>Email: info@nextstopchina.com</li>
          </ul>
          
          <p>Best regards,<br>
          The Next Stop China Team</p>
        </div>
        <div class="footer">
          <p>© 2025 Next Stop China. All rights reserved.</p>
          <p>Making education dreams come true.</p>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Contact form admin notification template
   */
  getContactFormAdminTemplate(contactData) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>New Contact Form Submission</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #ff6b6b; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .info-box { background: #e8f4fd; padding: 15px; border-left: 4px solid #667eea; margin: 15px 0; }
          .urgent { background: #fff3cd; border-left-color: #ffc107; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>New Contact Form Submission</h1>
        </div>
        <div class="content">
          <div class="info-box">
            <h3>Contact Information:</h3>
            <p><strong>Name:</strong> ${contactData.firstName} ${contactData.lastName}</p>
            <p><strong>Email:</strong> ${contactData.email}</p>
            <p><strong>Phone:</strong> ${contactData.phone}</p>
            <p><strong>Country:</strong> ${contactData.country}</p>
            <p><strong>Interested Program:</strong> ${contactData.program || 'Not specified'}</p>
          </div>
          
          <div class="info-box urgent">
            <h3>Message:</h3>
            <p>${contactData.message}</p>
          </div>
          
          <div class="info-box">
            <h3>Submission Details:</h3>
            <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>IP Address:</strong> ${contactData.ipAddress || 'Not available'}</p>
          </div>
          
          <p><strong>Action Required:</strong> Please respond to this inquiry within 24 hours.</p>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Application form confirmation email template
   */
  getApplicationFormConfirmationTemplate(applicationData) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Application Received - Next Stop China</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .highlight { background: #e8f4fd; padding: 15px; border-left: 4px solid #667eea; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Application Received Successfully!</h1>
        </div>
        <div class="content">
          <p>Dear ${applicationData.personalInfo.firstName},</p>
          
          <p>Thank you for submitting your application to Next Stop China! We have received your application and our team will review it carefully.</p>
          
          <div class="highlight">
            <strong>Application Summary:</strong><br>
            <strong>Name:</strong> ${applicationData.personalInfo.firstName} ${applicationData.personalInfo.lastName}<br>
            <strong>Email:</strong> ${applicationData.personalInfo.email}<br>
            <strong>Phone:</strong> ${applicationData.personalInfo.phone}<br>
            <strong>Nationality:</strong> ${applicationData.personalInfo.nationality}<br>
            <strong>Preferred Program:</strong> ${applicationData.program.preferredProgram}<br>
            <strong>Degree Level:</strong> ${applicationData.program.degreeLevel}<br>
            <strong>Preferred Start Date:</strong> ${applicationData.program.startDate}
          </div>
          
          <h3>What happens next?</h3>
          <ol>
            <li><strong>Initial Review (1-2 days):</strong> Our team will review your application for completeness</li>
            <li><strong>Document Verification (3-5 days):</strong> We'll verify your academic credentials</li>
            <li><strong>University Matching (1 week):</strong> We'll match you with suitable universities</li>
            <li><strong>Interview (if required):</strong> Some programs may require an interview</li>
            <li><strong>Final Decision (2 weeks):</strong> You'll receive your admission decision</li>
          </ol>
          
          <p>We will keep you updated throughout the process. If you have any questions or need to submit additional documents, please don't hesitate to contact us.</p>
          
          <p>Best regards,<br>
          The Next Stop China Admissions Team</p>
        </div>
        <div class="footer">
          <p>© 2025 Next Stop China. All rights reserved.</p>
          <p>Making education dreams come true.</p>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Application form admin notification template
   */
  getApplicationFormAdminTemplate(applicationData) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>New Application Submission</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #28a745; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .info-box { background: #e8f4fd; padding: 15px; border-left: 4px solid #667eea; margin: 15px 0; }
          .section { margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>New Application Submission</h1>
        </div>
        <div class="content">
          <div class="section">
            <h3>Personal Information:</h3>
            <div class="info-box">
              <p><strong>Name:</strong> ${applicationData.personalInfo.firstName} ${applicationData.personalInfo.lastName}</p>
              <p><strong>Email:</strong> ${applicationData.personalInfo.email}</p>
              <p><strong>Phone:</strong> ${applicationData.personalInfo.phone}</p>
              <p><strong>Nationality:</strong> ${applicationData.personalInfo.nationality}</p>
              <p><strong>Date of Birth:</strong> ${new Date(applicationData.personalInfo.dateOfBirth).toLocaleDateString()}</p>
            </div>
          </div>
          
          <div class="section">
            <h3>Academic Background:</h3>
            <div class="info-box">
              <p><strong>Current Education:</strong> ${applicationData.academic.currentEducation}</p>
              <p><strong>Institution:</strong> ${applicationData.academic.institution || 'Not provided'}</p>
              <p><strong>GPA:</strong> ${applicationData.academic.gpa || 'Not provided'}</p>
              <p><strong>Field of Study:</strong> ${applicationData.academic.fieldOfStudy || 'Not provided'}</p>
            </div>
          </div>
          
          <div class="section">
            <h3>Program Preferences:</h3>
            <div class="info-box">
              <p><strong>Degree Level:</strong> ${applicationData.program.degreeLevel}</p>
              <p><strong>Preferred Program:</strong> ${applicationData.program.preferredProgram}</p>
              <p><strong>Preferred University:</strong> ${applicationData.program.preferredUniversity || 'Any'}</p>
              <p><strong>Start Date:</strong> ${applicationData.program.startDate}</p>
            </div>
          </div>
          
          <div class="section">
            <h3>Documents Status:</h3>
            <div class="info-box">
              <p><strong>Transcript:</strong> ${applicationData.documents.transcript ? 'Yes' : 'No'}</p>
              <p><strong>Passport:</strong> ${applicationData.documents.passport ? 'Yes' : 'No'}</p>
              <p><strong>Language Test:</strong> ${applicationData.documents.languageTest ? 'Yes' : 'No'}</p>
              <p><strong>Recommendation:</strong> ${applicationData.documents.recommendation ? 'Yes' : 'No'}</p>
            </div>
          </div>
          
          <div class="section">
            <h3>Additional Information:</h3>
            <div class="info-box">
              <p><strong>Scholarship Interest:</strong> ${applicationData.additional.scholarshipInterest || 'Not specified'}</p>
              <p><strong>Personal Statement:</strong> ${applicationData.additional.personalStatement || 'Not provided'}</p>
            </div>
          </div>
          
          <div class="info-box">
            <h3>Submission Details:</h3>
            <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
            <p><strong>IP Address:</strong> ${applicationData.ipAddress || 'Not available'}</p>
          </div>
          
          <p><strong>Action Required:</strong> Please review this application and begin the evaluation process.</p>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Newsletter confirmation email template
   */
  getNewsletterConfirmationTemplate() {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Next Stop China Newsletter!</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .highlight { background: #e8f4fd; padding: 15px; border-left: 4px solid #667eea; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Welcome to Next Stop China!</h1>
        </div>
        <div class="content">
          <p>Thank you for subscribing to our newsletter!</p>
          
          <p>You'll now receive regular updates about:</p>
          <ul>
            <li>Latest scholarship opportunities</li>
            <li>New university partnerships</li>
            <li>Application deadlines and reminders</li>
            <li>Student success stories</li>
            <li>Tips for studying in China</li>
            <li>Visa and immigration updates</li>
          </ul>
          
          <div class="highlight">
            <strong>What to expect:</strong><br>
            • Weekly newsletter with the latest updates<br>
            • Special announcements for new programs<br>
            • Exclusive scholarship opportunities<br>
            • Tips and guides for international students
          </div>
          
          <p>If you have any questions or need assistance with your application, feel free to contact us anytime.</p>
          
          <p>Best regards,<br>
          The Next Stop China Team</p>
        </div>
        <div class="footer">
          <p>© 2025 Next Stop China. All rights reserved.</p>
          <p>Making education dreams come true.</p>
          <p><a href="#">Unsubscribe</a> | <a href="#">Update Preferences</a></p>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Newsletter admin notification template
   */
  getNewsletterAdminTemplate(subscriptionData) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>New Newsletter Subscription</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #17a2b8; color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .info-box { background: #e8f4fd; padding: 15px; border-left: 4px solid #667eea; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>New Newsletter Subscription</h1>
        </div>
        <div class="content">
          <div class="info-box">
            <h3>Subscription Details:</h3>
            <p><strong>Email:</strong> ${subscriptionData.email}</p>
            <p><strong>Source:</strong> ${subscriptionData.source || 'homepage'}</p>
            <p><strong>Status:</strong> ${subscriptionData.status || 'active'}</p>
            <p><strong>Subscribed:</strong> ${new Date(subscriptionData.createdAt || Date.now()).toLocaleString()}</p>
          </div>
          
          <div class="info-box">
            <h3>Submission Details:</h3>
            <p><strong>IP Address:</strong> ${subscriptionData.ipAddress || 'Not available'}</p>
            <p><strong>User Agent:</strong> ${subscriptionData.userAgent || 'Not available'}</p>
          </div>
          
          <p><strong>Note:</strong> A welcome email has been sent to the subscriber.</p>
        </div>
      </body>
      </html>
    `;
  }
}

module.exports = new EmailService();
