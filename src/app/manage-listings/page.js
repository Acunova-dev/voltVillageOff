"use client"
import React, { useState } from 'react';
import styles from './page.module.css';
import NavigationDrawer from '../../components/NavigationDrawer';

export default function ManageListings() {
  const [userListings, setUserListings] = useState([
    {
      id: 1,
      title: 'Arduino Uno',
      price: 25.99,
      stock: 3,
      description: 'Brand new Arduino Uno R3 board, perfect for electronics projects.',
      image: '/placeholder.jpg',
      status: 'active',
      views: 45,
      interested: 5
    },
    {
      id: 2,
      title: 'Raspberry Pi 4',
      price: 45.99,
      stock: 1,
      description: '4GB RAM model, barely used, comes with case and power supply.',
      image: '/placeholder.jpg',
      status: 'active',
      views: 32,
      interested: 3
    }
  ]);

  return (
    <div className={styles.container}>
      <NavigationDrawer />
      
      <main className={styles.main}>
        <div className={styles.header}>
          <h1>Manage Your Listings</h1>
          <button className={styles.createButton}>
            <i className="fas fa-plus"></i> Create New Listing
          </button>
        </div>

        <div className={styles.stats}>
          <div className={styles.statCard}>
            <i className="fas fa-tag"></i>
            <h3>Active Listings</h3>
            <p>{userListings.length}</p>
          </div>
          <div className={styles.statCard}>
            <i className="fas fa-eye"></i>
            <h3>Total Views</h3>
            <p>{userListings.reduce((sum, item) => sum + item.views, 0)}</p>
          </div>
          <div className={styles.statCard}>
            <i className="fas fa-user-friends"></i>
            <h3>Interested Buyers</h3>
            <p>{userListings.reduce((sum, item) => sum + item.interested, 0)}</p>
          </div>
        </div>

        <div className={styles.listingsTable}>
          <div className={styles.tableHeader}>
            <div className={styles.tableCell}>Item</div>
            <div className={styles.tableCell}>Price</div>
            <div className={styles.tableCell}>Stock</div>
            <div className={styles.tableCell}>Status</div>
            <div className={styles.tableCell}>Actions</div>
          </div>

          {userListings.map((listing) => (
            <div key={listing.id} className={styles.tableRow}>
              <div className={styles.tableCell}>
                <div className={styles.itemInfo}>
                  <img src={listing.image} alt={listing.title} className={styles.itemImage} />
                  <div>
                    <h3>{listing.title}</h3>
                    <p>{listing.description}</p>
                  </div>
                </div>
              </div>
              <div className={styles.tableCell}>${listing.price}</div>
              <div className={styles.tableCell}>
                <input 
                  type="number" 
                  value={listing.stock} 
                  className={styles.stockInput}
                  min="0"
                />
              </div>
              <div className={styles.tableCell}>
                <span className={`${styles.status} ${styles[listing.status]}`}>
                  {listing.status}
                </span>
              </div>
              <div className={styles.tableCell}>
                <div className={styles.actions}>
                  <button className={styles.actionButton}>
                    <i className="fas fa-edit"></i>
                  </button>
                  <button className={styles.actionButton}>
                    <i className="fas fa-trash"></i>
                  </button>
                  <button className={styles.actionButton}>
                    <i className="fas fa-chart-line"></i>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
} 