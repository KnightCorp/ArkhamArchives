/**
 * Test script to verify AI generation API endpoints
 * Run this to check if the APIs are accessible without actually generating content
 */

import { AIGenerationService } from '../components/socials/services/aiGenerationService';

export async function testAiApiEndpoints() {
  const contentTypes: Array<'image' | 'music' | 'video' | 'podcast'> = ['image', 'music', 'video', 'podcast'];
  
  console.log('🔍 Testing AI Generation API Endpoints...\n');
  
  for (const type of contentTypes) {
    try {
      console.log(`Testing ${type} API...`);
      const isAvailable = await AIGenerationService.checkApiStatus(type);
      
      if (isAvailable) {
        console.log(`✅ ${type.charAt(0).toUpperCase() + type.slice(1)} API is accessible`);
      } else {
        console.log(`❌ ${type.charAt(0).toUpperCase() + type.slice(1)} API is not accessible`);
      }
    } catch (error) {
      console.log(`⚠️  ${type.charAt(0).toUpperCase() + type.slice(1)} API test failed:`, error);
    }
    console.log(''); // Empty line for readability
  }
  
  console.log('🎯 API endpoint testing completed!');
}

// For testing error handling
export function testErrorHandling() {
  console.log('🔍 Testing error handling...\n');
  
  const testErrors = [
    new Error('Network error'),
    new Error('Request timeout - API took too long to respond'),
    new TypeError('fetch is not defined'),
    new Error('Invalid response format')
  ];
  
  testErrors.forEach((error, index) => {
    const friendlyMessage = AIGenerationService.getUserFriendlyError(error);
    console.log(`Test ${index + 1}: ${error.message}`);
    console.log(`Friendly: ${friendlyMessage}\n`);
  });
  
  console.log('✅ Error handling test completed!');
}

// Export for console testing
if (typeof window !== 'undefined') {
  (window as any).testAiApis = testAiApiEndpoints;
  (window as any).testErrorHandling = testErrorHandling;
}
