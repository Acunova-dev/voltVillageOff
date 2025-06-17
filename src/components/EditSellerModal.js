"use client"
import { useState, useEffect } from 'react';
import styles from './EditSellerModal.module.css';
import { FaTimes } from 'react-icons/fa';

const EditSellerModal = ({ seller, onClose, onSubmit }) => {
    console.log(seller);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (seller) {
      setFormData({
        name: seller.name || '',
        email: seller.email || '',
        phone: seller.phone || '',
        address: seller.address || '',
        notes: seller.notes || ''
      });
    }
  }, [seller]);

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

      const response = await fetch(`https://voltvillage-api.onrender.com/api/v1/ext-seller/${seller.id}`, {
        method: 'PATCH',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      console.log(response);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || `Failed to update seller: ${response.status}`);
      }

      const data = await response.json();
      onSubmit(data);
      onClose();
    } catch (err) {
      const errorMsg = err.message || 'Failed to update seller';
      setError(errorMsg);
      console.error('Error updating seller:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <div className={styles.modalHeader}>
          <h2>Edit Seller: {seller?.name}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {error && (
          <div className={styles.error}>
            <i className="fas fa-exclamation-circle"></i>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter seller name"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter email"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="phone">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="Enter phone number"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="address">Address</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Enter address"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Enter any additional notes"
              rows="3"
            />
          </div>

          <div className={styles.formActions}>
            <button 
              type="button" 
              className={styles.cancelButton} 
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditSellerModal; 