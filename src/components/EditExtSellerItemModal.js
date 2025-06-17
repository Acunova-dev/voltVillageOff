"use client"
import React, { useState, useEffect } from 'react';
import { AdvancedImage, responsive, placeholder } from '@cloudinary/react';
import styles from './EditExtSellerItemModal.module.css';
import CloudinaryUploadWidget from './CloudinaryUploadWidget';
import { cld, getOptimizedImageUrl } from '@/utils/cloudinary';
import { FaTimes, FaSpinner } from 'react-icons/fa';

const EditExtSellerItemModal = ({ item, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    quantity: 1,
    category: '',
    condition: '',
    location: '',
    listing_status: 'ACTIVE',
    is_active: true,
    is_deleted: false,
    photo_urls: []
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (item) {
      setFormData({
        title: item.title || '',
        description: item.description || '',
        price: item.price || '',
        quantity: item.quantity || 1,
        category: item.category || '',
        condition: item.condition || '',
        location: item.location || '',
        listing_status: item.listing_status || 'ACTIVE',
        is_active: item.is_active !== undefined ? item.is_active : true,
        is_deleted: item.is_deleted !== undefined ? item.is_deleted : false,
        photo_urls: item.photo_urls.map(url => ({ photo_url: url.photo_url, public_id: url.public_id || url.photo_url.split('/').pop().split('.')[0] })) || []
      });
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (formData.photo_urls.length === 0) {
      setError('Please upload at least one photo');
      setLoading(false);
      return;
    }

    const requiredFields = ['title', 'price', 'category', 'condition', 'location'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    if (missingFields.length > 0) {
      setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        const errorMsg = 'Authentication token not found. Please log in again.';
        setError(errorMsg);
        setLoading(false);
        return;
      }

      const submissionData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        category: formData.category,
        condition: formData.condition,
        location: formData.location.trim(),
        listing_status: formData.listing_status,
        is_active: formData.is_active,
        is_deleted: formData.is_deleted,
        photo_urls: formData.photo_urls.map(photo => photo.photo_url)
      };

      console.log('Submitting updated item data:', submissionData);

      const response = await fetch(`https://voltvillage-api.onrender.com/api/v1/items/${item.id}`, {
        method: 'PUT',
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submissionData)
      });

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (jsonError) {
          console.error('Failed to parse error response:', jsonError);
          throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
        throw new Error(errorData.detail || `Failed to update item: ${response.status}`);
      }

      const data = await response.json();
      onSubmit(data);
      onClose();
    } catch (err) {
      console.error('Submission error:', err);
      setError(err.message || 'Failed to update item');
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

        <h2>Edit Item: {item?.title}</h2>

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
            />
          </div>          
          <div className={`${styles.formGroup} ${styles.optional}`}>
            <label htmlFor="description">Description </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
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
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="listing_status">Listing Status</label>
            <select
              id="listing_status"
              name="listing_status"
              value={formData.listing_status}
              onChange={handleChange}
              required
            >
              <option value="ACTIVE">Active</option>
              <option value="SOLD">Sold</option>
              <option value="UNAVAILABLE">Unavailable</option>
            </select>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="is_active">Is Active</label>
              <input
                type="checkbox"
                id="is_active"
                name="is_active"
                checked={formData.is_active}
                onChange={handleCheckboxChange}
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="is_deleted">Is Deleted</label>
              <input
                type="checkbox"
                id="is_deleted"
                name="is_deleted"
                checked={formData.is_deleted}
                onChange={handleCheckboxChange}
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Photos </label>
            <div className={styles.uploadContainer}>
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
          </div>          
          <div className={styles.actions}>
            <button type="button" onClick={onClose} className={styles.cancelButton}>
              <FaTimes />
              Cancel
            </button>
            <button type="submit" className={styles.submitButton} disabled={loading}>
              {loading ? (
                <>
                  <FaSpinner className={styles.spinner} />
                  Saving...
                </>
              ) : (
                <>
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditExtSellerItemModal; 