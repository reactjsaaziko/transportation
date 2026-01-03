#!/usr/bin/env node

/**
 * Create Test Service Provider Account
 * 
 * This script creates a test service provider account that you can use to login
 * to the transportation frontend.
 */

import axios from 'axios';
import fs from 'fs';

const API_GATEWAY_URL = 'http://localhost:3030';

// Test user credentials
const testUser = {
  username: 'test_transport_provider',
  workEmail: 'transport.test@aaziko.com',
  sendEmail: false // Don't send email, just create account
};

async function createTestUser() {
  try {
    console.log('🔄 Creating test service provider account...\n');
    console.log('📧 Email:', testUser.workEmail);
    console.log('👤 Username:', testUser.username);
    console.log('');

    const response = await axios.post(
      `${API_GATEWAY_URL}/service-provider/users/register`,
      testUser,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000
      }
    );

    if (response.data.success) {
      console.log('✅ SUCCESS! Account created successfully!\n');
      console.log('═══════════════════════════════════════════════════════');
      console.log('🔑 LOGIN CREDENTIALS');
      console.log('═══════════════════════════════════════════════════════');
      console.log('');
      console.log('📧 Email:    ', response.data.data.credentials.email);
      console.log('🔐 Password: ', response.data.data.credentials.temporaryPassword);
      console.log('');
      console.log('═══════════════════════════════════════════════════════');
      console.log('');
      console.log('🌐 Login URL: http://localhost:3070/login');
      console.log('');
      console.log('📝 User Details:');
      console.log('   - Username:', response.data.data.user.username);
      console.log('   - Email:', response.data.data.user.email);
      console.log('   - Role:', response.data.data.user.role);
      console.log('   - User ID:', response.data.data.user.id);
      console.log('');
      console.log('💡 TIP: Copy the email and password above to login!');
      console.log('');

      // Save credentials to file for easy reference
      const credentials = {
        email: response.data.data.credentials.email,
        password: response.data.data.credentials.temporaryPassword,
        username: response.data.data.user.username,
        userId: response.data.data.user.id,
        loginUrl: 'http://localhost:3070/login',
        createdAt: new Date().toISOString()
      };

      fs.writeFileSync(
        'test-credentials.json',
        JSON.stringify(credentials, null, 2)
      );

      console.log('💾 Credentials saved to: test-credentials.json');
      console.log('');

    } else {
      console.error('❌ Failed to create account');
      console.error('Message:', response.data.message);
      console.error('Code:', response.data.code);
    }

  } catch (error) {
    console.error('❌ ERROR creating test user:\n');
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Message:', error.response.data.message || error.response.data);
      console.error('Code:', error.response.data.code);
      
      if (error.response.data.code === 'EMAIL_EXISTS') {
        console.log('\n💡 TIP: This email already exists. Try using the existing credentials or use a different email.');
        console.log('\nExisting credentials might be in: test-credentials.json');
      }
    } else if (error.request) {
      console.error('❌ No response from server. Is the API Gateway running?');
      console.error('\n🔧 Start the backend services:');
      console.error('   cd /home/aaziko/Documents/1tb-hd/aaziko/common-backend');
      console.error('   docker compose up api-gateway service-provider -d');
    } else {
      console.error('Error:', error.message);
    }
    
    process.exit(1);
  }
}

// Run the script
createTestUser();
