// Quick test script to check if backend upload server is working
const testBackendUpload = async () => {
  try {
    const response = await fetch("http://localhost:3001/health");
    if (response.ok) {
      console.log("✅ Backend upload server is running!");
      console.log("🎯 This is the BEST solution for your upload issues");
      console.log("📁 Upload endpoint: http://localhost:3001/api/upload");
      return true;
    }
  } catch (error) {
    console.log("❌ Backend upload server is not running");
    console.log("🚀 To start it: node backend-upload-server.js");
    console.log(
      "📦 Or install dependencies first: npm install express multer cloudinary cors dotenv"
    );
    return false;
  }
};

// Test Cloudinary configuration
const testCloudinaryConfig = () => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  console.log("🔧 Cloudinary Configuration:");
  console.log(`   Cloud Name: ${cloudName || "❌ Missing"}`);
  console.log(`   Upload Preset: ${uploadPreset || "❌ Missing"}`);

  if (!cloudName) {
    console.log("⚠️  Add VITE_CLOUDINARY_CLOUD_NAME to your .env file");
  }

  if (!uploadPreset) {
    console.log("⚠️  Add VITE_CLOUDINARY_UPLOAD_PRESET to your .env file");
  }
};

// Run tests
console.log("🧪 Testing upload configuration...");
testCloudinaryConfig();
testBackendUpload();

export { testBackendUpload, testCloudinaryConfig };
