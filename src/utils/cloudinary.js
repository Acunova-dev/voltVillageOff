import { Cloudinary } from '@cloudinary/url-gen';
import axios from 'axios';

const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const uploadPreset = 'voltvillage'; // Your upload preset name

if (!cloudName) {
  console.error('Please set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME environment variable');
}

// Create and export Cloudinary instance
export const cld = new Cloudinary({
  cloud: {
    cloudName
  }
});

// Function to upload file to Cloudinary
export const uploadToCloudinary = async (file, onProgress) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', 'listings');

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress) {
            const { loaded, total } = progressEvent;
            const progress = Math.round((loaded * 100) / total);
            onProgress(progress);
          }
        },
      }
    );

    return {
      secure_url: response.data.secure_url,
      public_id: response.data.public_id
    };
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
};

// Helper function to get optimized image URL
export const getOptimizedImageUrl = (publicId) => {
  return cld
    .image(publicId)
    .format('auto')
    .quality('auto')
    .resize({
      width: 500,
      height: 500,
      type: 'fill',
      gravity: 'auto'
    })
    .toURL();
};

// Upload widget configuration
export const getUploadConfig = () => ({
  cloudName,
  uploadPreset,
  folder: 'listings',
  sources: ['local', 'url', 'camera'],
  multiple: true,
  maxFiles: 5,
  maxFileSize: 5000000, // 5MB
  clientAllowedFormats: ['image'],
  styles: {
    palette: {
      window: "#ffffff",
      sourceBg: "#f4f4f5",
      windowBorder: "#90a0b3",
      tabIcon: "#4f46e5",
      inactiveTabIcon: "#6b7280",
      menuIcons: "#6b7280",
      link: "#4f46e5",
      action: "#4f46e5",
      inProgress: "#4f46e5",
      complete: "#22c55e",
      error: "#ef4444",
      textDark: "#1f2937",
      textLight: "#ffffff"
    }
  }
});
