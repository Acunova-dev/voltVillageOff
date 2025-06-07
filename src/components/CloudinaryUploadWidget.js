"use client"
import { useRef, useState } from 'react';
import { uploadToCloudinary } from '@/utils/cloudinary';
import styles from './CreateListingModal.module.css';

const CloudinaryUploadWidget = ({ onUploadSuccess, onUploadError }) => {
  const fileInputRef = useRef();
  const [isUploading, setIsUploading] = useState(false);
  const handleFileChange = async (event) => {
    const files = event.target.files;
    if (!files.length) return;

    setIsUploading(true);
    try {
      for (const file of files) {
        const result = await uploadToCloudinary(file);
        onUploadSuccess?.({
          public_id: result.public_id,
          secure_url: result.secure_url
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      onUploadError?.(error);
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };
  return (
    <div className={styles.uploadWidgetContainer}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <button 
        type="button" 
        className={styles.uploadButton}
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
      >
        <i className="fas fa-cloud-upload-alt"></i>
        <span>{isUploading ? 'Uploading...' : 'Upload Photos'}</span>
      </button>
      {isUploading && (
        <div className={styles.uploadProgress}>
          <div className={styles.progressBar} style={{ width: '100%', animation: 'progressAnimation 1s infinite' }} />
        </div>
      )}
    </div>
  );
};

export default CloudinaryUploadWidget;
