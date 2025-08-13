// Cloudinary configuration test utility
// Use this to verify your Cloudinary setup

export const testCloudinaryConfig = async () => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  console.log("Testing Cloudinary Configuration:");
  console.log("Cloud Name:", cloudName);
  console.log("Upload Preset:", uploadPreset);

  // Test if we can reach Cloudinary API
  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
      {
        method: "POST",
        body: new FormData(), // Empty form data just to test endpoint
      }
    );

    console.log("Cloudinary API Response Status:", response.status);

    if (response.status === 400) {
      const errorText = await response.text();
      console.log("Cloudinary API Error Response:", errorText);

      // Parse error if possible
      try {
        const errorData = JSON.parse(errorText);
        console.log("Parsed Error:", errorData);

        if (errorData.error?.message?.includes("upload_preset")) {
          console.log("❌ Upload preset issue detected");
          console.log("💡 Possible solutions:");
          console.log(
            "1. Check if upload preset exists in Cloudinary dashboard"
          );
          console.log('2. Ensure upload preset is set to "Unsigned"');
          console.log('3. Try using "ml_default" preset name');
        }
      } catch (e) {
        console.log("Raw error response:", errorText);
      }
    }
  } catch (error) {
    console.error("Network error testing Cloudinary:", error);
  }
};

// Test with a small image blob to verify upload preset works
export const testUploadPreset = async () => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  // Create a tiny test image (1x1 pixel PNG)
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  const ctx = canvas.getContext("2d");
  ctx!.fillStyle = "#000000";
  ctx!.fillRect(0, 0, 1, 1);

  return new Promise((resolve) => {
    canvas.toBlob(async (blob) => {
      if (!blob) {
        console.error("Failed to create test blob");
        resolve(false);
        return;
      }

      const formData = new FormData();
      formData.append("file", blob, "test.png");
      formData.append("upload_preset", uploadPreset);

      try {
        console.log("Testing upload with preset:", uploadPreset);
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        console.log("Test upload response status:", response.status);

        if (response.ok) {
          const result = await response.json();
          console.log(
            "✅ Upload preset works! Test image uploaded:",
            result.public_id
          );
          resolve(true);
        } else {
          const errorText = await response.text();
          console.log("❌ Upload preset test failed:", errorText);
          resolve(false);
        }
      } catch (error) {
        console.error("❌ Upload preset test error:", error);
        resolve(false);
      }
    }, "image/png");
  });
};

// Common upload preset names to try
export const commonUploadPresets = [
  "ml_default",
  "arkham_uploads",
  "unsigned_upload",
  "default",
  "preset_default",
  "web_upload",
];

export const tryDifferentPresets = async () => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;

  console.log("Trying different upload presets...");

  for (const preset of commonUploadPresets) {
    console.log(`Testing preset: ${preset}`);

    // Create minimal form data
    const formData = new FormData();
    formData.append("upload_preset", preset);
    // Add a tiny data URI image for testing
    const dataUri =
      "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
    const blob = await fetch(dataUri).then((r) => r.blob());
    formData.append("file", blob);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        console.log(`✅ Found working preset: ${preset}`);
        return preset;
      } else {
        const errorText = await response.text();
        console.log(
          `❌ Preset ${preset} failed:`,
          response.status,
          errorText.substring(0, 100)
        );
      }
    } catch (error) {
      console.log(`❌ Error testing preset ${preset}:`, error);
    }
  }

  console.log("❌ No working upload presets found");
  return null;
};
