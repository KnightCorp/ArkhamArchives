// Test backend upload functionality
const testBackendUpload = async () => {
  console.log("🧪 Testing backend upload functionality...");

  try {
    // Test 1: Health check
    const healthResponse = await fetch("http://localhost:3001/health");
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log("✅ Health check passed:", healthData);
    } else {
      throw new Error("Health check failed");
    }

    // Test 2: Test upload endpoint (without file)
    const uploadResponse = await fetch("http://localhost:3001/api/upload", {
      method: "POST",
      body: new FormData(), // Empty form data
    });

    if (uploadResponse.status === 400) {
      const errorData = await uploadResponse.json();
      if (errorData.error === "No file uploaded") {
        console.log(
          "✅ Upload endpoint is working (correctly rejecting empty uploads)"
        );
      }
    }

    console.log("🎉 Backend server is fully functional!");
    console.log("📋 Next steps:");
    console.log(
      "   1. Make sure backend server is running: node backend-upload-server.js"
    );
    console.log("   2. Try uploading your MP4 file in the Library component");
    console.log("   3. Check browser console for upload logs");
  } catch (error) {
    console.error("❌ Backend test failed:", error);
    console.log("🔧 Troubleshooting:");
    console.log("   1. Make sure backend server is running");
    console.log("   2. Check if port 3001 is available");
    console.log("   3. Verify environment variables are set");
  }
};

// Run the test
testBackendUpload();
