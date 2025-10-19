/**
 * Simple API test script
 * Run with: node test/api-test.js
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Test data
const contactFormData = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '+1234567890',
  country: 'United States',
  program: 'MBBS',
  message: 'I am interested in studying medicine in China. Please provide more information about the application process.'
};

const applicationFormData = {
  personalInfo: {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phone: '+1234567891',
    nationality: 'Canadian',
    dateOfBirth: '1995-01-01'
  },
  academic: {
    currentEducation: 'High School Graduate',
    institution: 'ABC High School',
    gpa: '3.8',
    graduationYear: '2023',
    fieldOfStudy: 'Science'
  },
  program: {
    degreeLevel: 'bachelors',
    preferredProgram: 'Computer Science',
    preferredUniversity: 'Tsinghua University',
    startDate: 'Fall 2024'
  },
  documents: {
    transcript: true,
    passport: true,
    languageTest: false,
    recommendation: true
  },
  additional: {
    scholarshipInterest: 'yes',
    personalStatement: 'I am passionate about technology and want to pursue my studies in China.',
    previousExperience: 'I have basic programming experience and have completed several online courses.'
  }
};

const newsletterData = {
  email: 'newsletter@example.com',
  source: 'homepage'
};

async function testHealthCheck() {
  try {
    console.log('Testing health check...');
    const response = await axios.get(`${BASE_URL}/health`);
    console.log('✅ Health check passed:', response.data);
  } catch (error) {
    console.error('❌ Health check failed:', error.message);
  }
}

async function testContactForm() {
  try {
    console.log('\nTesting contact form submission...');
    const response = await axios.post(`${BASE_URL}/forms/contact`, contactFormData);
    console.log('✅ Contact form submitted successfully:', response.data);
  } catch (error) {
    console.error('❌ Contact form submission failed:', error.response?.data || error.message);
  }
}

async function testApplicationForm() {
  try {
    console.log('\nTesting application form submission...');
    const response = await axios.post(`${BASE_URL}/forms/application`, applicationFormData);
    console.log('✅ Application form submitted successfully:', response.data);
  } catch (error) {
    console.error('❌ Application form submission failed:', error.response?.data || error.message);
  }
}

async function testNewsletterSubscription() {
  try {
    console.log('\nTesting newsletter subscription...');
    const response = await axios.post(`${BASE_URL}/forms/newsletter`, newsletterData);
    console.log('✅ Newsletter subscription successful:', response.data);
  } catch (error) {
    console.error('❌ Newsletter subscription failed:', error.response?.data || error.message);
  }
}

async function testNewsletterUnsubscribe() {
  try {
    console.log('\nTesting newsletter unsubscribe...');
    const response = await axios.post(`${BASE_URL}/forms/newsletter/unsubscribe`, {
      email: newsletterData.email
    });
    console.log('✅ Newsletter unsubscribe successful:', response.data);
  } catch (error) {
    console.error('❌ Newsletter unsubscribe failed:', error.response?.data || error.message);
  }
}

async function testEmailService() {
  try {
    console.log('\nTesting email service configuration...');
    const response = await axios.get(`${BASE_URL}/email/test`);
    console.log('✅ Email service test:', response.data);
  } catch (error) {
    console.error('❌ Email service test failed:', error.response?.data || error.message);
  }
}

async function runAllTests() {
  console.log('🚀 Starting API tests...\n');
  
  await testHealthCheck();
  await testContactForm();
  await testApplicationForm();
  await testNewsletterSubscription();
  await testNewsletterUnsubscribe();
  await testEmailService();
  
  console.log('\n✨ All tests completed!');
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = {
  testHealthCheck,
  testContactForm,
  testApplicationForm,
  testNewsletterSubscription,
  testNewsletterUnsubscribe,
  testEmailService,
  runAllTests
};

