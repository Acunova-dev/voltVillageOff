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
  const { user } = useAuth();

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
  }, [fetchUserListings]);

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
          <h2>Account Settings</h2>
          <div className={styles.settingsForm}>
            <div className={styles.formGroup}>
              <label>Email</label>
              <input type="email" value={user?.email || ''} readOnly />
            </div>
            <div className={styles.formGroup}>
              <label>Phone Number</label>
              <input type="tel" value={user?.phone_number || ''} readOnly />
            </div>
            <div className={styles.formGroup}>
              <label>Gender</label>
              <input type="text" value={user?.gender || ''} readOnly />
            </div>
            <button className={styles.editButton}>
              Edit Profile
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}