"use client"
import React, { useState, useEffect, useCallback } from 'react';
import styles from './page.module.css';
import Image from 'next/image';
import NavigationDrawer from '../../components/NavigationDrawer';
import InteractiveListingCard from '../../components/InteractiveListingCard';
import { items } from '../../utils/api';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const [userListings, setUserListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    phone_number: '',
    gender: ''
  });

  const fetchUserListings = useCallback(async () => {
    try {
      setLoading(true);
      const response = await items.getMyItems();
      const listingsData = response.data || response || [];
      setUserListings(Array.isArray(listingsData) ? listingsData : []);
    } catch (err) {
      setError('Failed to load your listings');
      console.error('Error fetching user listings:', err);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    fetchUserListings();
    if (user) {
      setFormData({
        phone_number: user.phone_number || '',
        gender: user.gender || ''
      });
    }
  }, [fetchUserListings, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      // Here you would make an API call to update the user's profile
      // await updateUserProfile(formData);
      setIsEditing(false);
      // You'd want to refresh the user data here
    } catch (err) {
      setError('Failed to update profile');
      console.error('Error updating profile:', err);
    }
  };

  return (
    <div className={styles.container}>
      <NavigationDrawer />
      
      <main className={styles.main}>
        <div className={styles.profileHeader}>
          <div className={styles.avatar}>
            {user?.profile_image ? (
              <Image
                src={user.profile_image}
                alt={`${user.name}'s profile`}
                width={100}
                height={100}
                unoptimized
                style={{ 
                  borderRadius: '50%',
                  objectFit: 'cover' 
                }}
              />
            ) : (
              user?.name?.charAt(0) || '?'
            )}
          </div>
          <div className={styles.userInfo}>
            <h1>{user?.name} {user?.surname}</h1>
            <p>{user?.email}</p>
            <p>{user?.department || 'Department not set'} • {user?.yearOfStudy || 'Year not set'}</p>
          </div>
        </div>

        <div className={styles.stats}>
          <div className={styles.statCard}>
            <h3>Active Listings</h3>
            <p>{userListings.filter(item => item.listing_status === 'active').length}</p>
          </div>
          <div className={styles.statCard}>
            <h3>Sold Items</h3>
            <p>{userListings.filter(item => item.listing_status === 'sold').length}</p>
          </div>
          <div className={styles.statCard}>
            <h3>Total Listings</h3>
            <p>{userListings.length}</p>
          </div>
        </div>

        <div className={styles.section}>
          <h2>Your Listings</h2>
          {error && <div className={styles.error}>{error}</div>}
          {loading ? (
            <div className={styles.loading}>Loading your listings...</div>
          ) : (
            <div className={styles.grid}>
              {userListings.map((listing) => (
                <InteractiveListingCard 
                  key={listing.id} 
                  item={{
                    ...listing,
                    image: listing.photo_urls?.[0]?.photo_url || '/placeholder.jpg',
                    location: listing.location || 'Not specified',
                    condition: listing.condition || 'Not specified',
                    category: listing.category || 'Other'
                  }}
                />
              ))}
            </div>
          )}
        </div>

        <div className={styles.section}>
          <h2>Account Settings</h2>          <div className={styles.settingsForm}>
            <div className={styles.formGroup}>
              <label>Email</label>
              <input type="email" value={user?.email || ''} readOnly />
            </div>
            <div className={styles.formGroup}>
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone_number"
                value={isEditing ? formData.phone_number : (user?.phone_number || '')}
                onChange={handleChange}
                readOnly={!isEditing}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Gender</label>
              {isEditing ? (
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={styles.select}
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              ) : (
                <input type="text" value={user?.gender || ''} readOnly />
              )}
            </div>
            <div className={styles.buttonGroup}>
              {isEditing ? (
                <>
                  <button className={styles.cancelButton} onClick={() => setIsEditing(false)}>
                    Cancel
                  </button>
                  <button className={styles.saveButton} onClick={handleSubmit}>
                    Save Changes
                  </button>
                </>
              ) : (
                <button className={styles.editButton} onClick={() => setIsEditing(true)}>
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}