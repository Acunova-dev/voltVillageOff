import React from 'react';
import styles from './page.module.css';
import NavigationDrawer from '../../components/NavigationDrawer';
import InteractiveListingCard from '../../components/InteractiveListingCard';

export default function Profile() {
  // Mock user data
  const user = {
    name: 'John Doe',
    email: 'john.doe@university.edu',
    department: 'Electrical Engineering',
    yearOfStudy: '4th Year',
    listings: [
      {
        title: 'Arduino Uno',
        price: 25.99,
        description: 'Brand new Arduino Uno R3 board, perfect for electronics projects.',
        image: '/placeholder.jpg',
        location: 'Engineering Building',
        condition: 'New',
        category: 'Microcontrollers'
      }
    ]
  };

  return (
    <div className={styles.container}>
      <NavigationDrawer />
      
      <main className={styles.main}>
        <div className={styles.profileHeader}>
          <div className={styles.avatar}>
            {user.name.charAt(0)}
          </div>
          <div className={styles.userInfo}>
            <h1>{user.name}</h1>
            <p>{user.email}</p>
            <p>{user.department} • {user.yearOfStudy}</p>
          </div>
        </div>

        <div className={styles.stats}>
          <div className={styles.statCard}>
            <h3>Active Listings</h3>
            <p>{user.listings.length}</p>
          </div>
          <div className={styles.statCard}>
            <h3>Sold Items</h3>
            <p>0</p>
          </div>
          <div className={styles.statCard}>
            <h3>Rating</h3>
            <p>⭐ 4.5</p>
          </div>
        </div>

        <div className={styles.section}>
          <h2>Your Listings</h2>
          <div className={styles.grid}>
            {user.listings.map((listing, index) => (
              <InteractiveListingCard key={index} item={listing} />
            ))}
          </div>
        </div>

        <div className={styles.section}>
          <h2>Account Settings</h2>
          <div className={styles.settingsForm}>
            <div className={styles.formGroup}>
              <label>Email</label>
              <input type="email" value={user.email} readOnly />
            </div>
            <div className={styles.formGroup}>
              <label>Department</label>
              <input type="text" value={user.department} readOnly />
            </div>
            <div className={styles.formGroup}>
              <label>Year of Study</label>
              <input type="text" value={user.yearOfStudy} readOnly />
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