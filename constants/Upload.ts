import { CLOUDINARY_URL, CLOUDINARY_UPLOAD_PRESET, CLOUDINARY_CLOUD_NAME } from './CloudinaryConfig';

export const uploadImages = async (files: File[]): Promise<string[]> => {
    if (!files || files.length === 0) {
        return [];
    }

    console.log("Upload configuration:", {
        cloudName: CLOUDINARY_CLOUD_NAME,
        uploadUrl: CLOUDINARY_URL,
        preset: CLOUDINARY_UPLOAD_PRESET
    });

    const imageUrls: string[] = [];

    // Process each file
    for (const file of files) {
        try {
            console.log(`Preparing to upload file: ${file.name} (${file.type}, ${file.size} bytes)`);

            // Create form data for the upload
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

            console.log(`Starting upload to ${CLOUDINARY_URL} with preset "${CLOUDINARY_UPLOAD_PRESET}"`);

            // Upload to Cloudinary
            const response = await fetch(CLOUDINARY_URL, {
                method: 'POST',
                body: formData,
            });

            console.log(`Response status: ${response.status} ${response.statusText}`);

            // Parse response JSON
            const data = await response.json();
            console.log("Response data:", data);

            // Check for errors
            if (response.ok) {
                if (data.secure_url) {
                    imageUrls.push(data.secure_url);
                    console.log("✅ Upload successful, got URL:", data.secure_url);
                } else {
                    console.error("⚠️ Missing secure_url in successful response", data);
                    throw new Error("Upload succeeded but no image URL was returned");
                }
            } else {
                console.error("❌ Upload failed with status:", response.status);
                const errorMessage = data.error?.message || JSON.stringify(data.error) || "Unknown upload error";
                throw new Error(errorMessage);
            }
        } catch (error: any) {
            console.error('❌ Error in upload process:', error);
            throw error; // Re-throw to handle in the component
        }
    }

    console.log(`Completed uploads, got ${imageUrls.length} URLs`);
    return imageUrls;
};
