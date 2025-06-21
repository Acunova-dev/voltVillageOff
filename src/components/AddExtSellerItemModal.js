"use client"
import React, { useState } from 'react';
import { AdvancedImage, responsive, placeholder } from '@cloudinary/react';
import styles from './AddExtSellerItemModal.module.css';
import CloudinaryUploadWidget from './CloudinaryUploadWidget';
import { cld, getOptimizedImageUrl } from '@/utils/cloudinary';
import { FaTimes, FaPlus, FaSpinner } from 'react-icons/fa';
import { FaUpload, FaTrash } from 'react-icons/fa';
import { CldUploadWidget } from 'next-cloudinary';
import { externalSellers } from '@/utils/api';

const AddExtSellerItemModal = ({ sellerId, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    quantity: 1,
    category: '',
    condition: '',
    location: '',
    photo_urls: []
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        const errorMsg = 'Authentication token not found. Please log in again.';
        setError(errorMsg);
        return;
      }

      // Format the data according to API expectations
      const submissionData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        category: formData.category,
        condition: formData.condition,
        location: formData.location.trim(),
        listing_status: 'ACTIVE',
        photo_urls: formData.photo_urls.map(photo => photo.photo_url)
      };

      console.log('Submitting item data:', submissionData);

      const data = await externalSellers.createItem(sellerId, submissionData);
      onSubmit(data);
      onClose();
    } catch (err) {
      console.error('Submission error:', err);
      setError(err.response?.data?.detail || err.message || 'Failed to create item');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = (result) => {
    const newImage = {
      photo_url: result.secure_url,
      public_id: result.public_id,
      optimized_url: getOptimizedImageUrl(result.public_id)
    };

    setFormData(prev => ({
      ...prev,
      photo_urls: [...prev.photo_urls, newImage]
    }));
  };

  const handleUploadError = (error) => {
    console.error('Upload error:', error);
    setError('Failed to upload image. Please try again.');
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      photo_urls: prev.photo_urls.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end' }}>
          <button className={styles.closeButton} onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <h2>Add New Item</h2>

        {error && (
          <div className={styles.error}>
            <i className="fas fa-exclamation-circle"></i>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Title </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g., Arduino Uno R3"
            />
          </div>          
          <div className={`${styles.formGroup} ${styles.optional}`}>
            <label htmlFor="description">Description </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your item's features and condition"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="location">Location </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              placeholder="e.g., Bulawayo, Harare"
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="price">Price (USD)</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="quantity">Quantity </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
                min="1"
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="category">Category </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                <option value="microcontrollers">Microcontrollers</option>
                <option value="development_boards">Development Boards</option>
                <option value="displays">Displays</option>
                <option value="sensors">Sensors</option>
                <option value="motors">Motors</option>
                <option value="motor_drivers">Motor Drivers</option>
                <option value="power_supply">Power Supply</option>
                <option value="electronic_components">Electronic Components</option>
                <option value="communication">Communication</option>
                <option value="connectors">Connectors</option>
                <option value="cables">Cables</option>
                <option value="mechanical">Mechanical</option>
                <option value="tools">Tools</option>
                <option value="robotics">Robotics</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="condition">Condition </label>
              <select
                id="condition"
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                required
              >
                <option value="">Select Condition</option>
                <option value="new">New</option>
                <option value="like_new">Used - Like New</option>
                <option value="good">Used - Good</option>
                <option value="fair">Used - Fair</option>
                <option value="poor">Poor</option>
                <option value="unknown">Unknown</option>
              </select>
            </div>
          </div>          <div className={styles.formGroup}>
            <label>Photos </label>          <div className={styles.uploadContainer}>
              <CloudinaryUploadWidget
                onUploadSuccess={handleUploadSuccess}
                onUploadError={handleUploadError}
              />
              {formData.photo_urls.length > 0 && (
                <div className={styles.previewImages}>
                  {formData.photo_urls.map((photo, index) => (
                    <div key={photo.public_id} className={styles.previewImage}>
                      <AdvancedImage
                        cldImg={cld.image(photo.public_id)}
                        plugins={[responsive(), placeholder()]}
                      />
                      <button
                        type="button"
                        className={styles.removeImage}
                        onClick={() => removeImage(index)}
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>          <div className={styles.actions}>
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              <FaTimes />
              Cancel
            </button>
            <button type="submit" className={styles.submitButton} disabled={loading}>
              {loading ? (
                <>
                  <FaSpinner className={styles.spinner} />
                  Adding...
                </>
              ) : (
                <>
                  <FaPlus />
                  Add Item
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExtSellerItemModal; 