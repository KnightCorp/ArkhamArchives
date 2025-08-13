// API Testing Utility
// Use this in browser console to test your APIs

const testAPI = async (url, prompt = "test prompt") => {
  console.log(`Testing API: ${url}`);
  
  // Test different HTTP methods
  const methods = ['GET', 'POST'];
  
  for (const method of methods) {
    try {
      console.log(`\n--- Testing ${method} method ---`);
      
      let options = {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        }
      };
      
      let testUrl = url;
      
      if (method === 'POST') {
        options.body = JSON.stringify({ prompt });
      } else if (method === 'GET') {
        // Try with query parameters
        const params = new URLSearchParams({ prompt });
        testUrl = `${url}?${params}`;
      }
      
      console.log(`URL: ${testUrl}`);
      console.log(`Options:`, options);
      
      const response = await fetch(testUrl, options);
      
      console.log(`Status: ${response.status} ${response.statusText}`);
      console.log(`Headers:`, Object.fromEntries(response.headers.entries()));
      
      if (response.ok) {
        try {
          const data = await response.json();
          console.log(`Response:`, data);
        } catch (e) {
          const text = await response.text();
          console.log(`Response (text):`, text);
        }
        return { method, url: testUrl, success: true, status: response.status };
      } else {
        console.log(`Failed with status: ${response.status}`);
      }
      
    } catch (error) {
      console.error(`${method} failed:`, error);
    }
  }
};

// Test all your APIs
const testAllAPIs = async () => {
  const apis = [
    'https://spectrum-api-343916782787.us-central1.run.app',
    'https://replicate-music-api-343916782787.us-central1.run.app/',
    'https://replicate-video-api-343916782787.us-central1.run.app',
    'https://connection-api-343916782787.us-central1.run.app',
    'https://replicate-api-343916782787.us-central1.run.app'
  ];
  
  for (const api of apis) {
    await testAPI(api);
    console.log('\n' + '='.repeat(50) + '\n');
  }
};

// Export for use
window.testAPI = testAPI;
window.testAllAPIs = testAllAPIs;

console.log('API Tester loaded! Use:');
console.log('- testAPI("your-api-url") to test a single API');
console.log('- testAllAPIs() to test all your APIs');
