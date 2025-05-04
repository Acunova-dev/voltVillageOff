"use client"
import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import NavigationDrawer from '../../components/NavigationDrawer';
import { items } from '../../utils/api';

export default function ManageListings() {
  const [userListings, setUserListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserListings();
  }, []);

  const fetchUserListings = async () => {
    try {
      setLoading(true);
      const data = await items.getMyItems();
      setUserListings(data);
    } catch (err) {
      setError('Failed to load your listings');
      console.error('Error fetching user listings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStockUpdate = async (id, newStock) => {
    try {
      await items.update(id, { stock: newStock });
      setUserListings(listings => 
        listings.map(item => 
          item.id === id ? { ...item, stock: newStock } : item
        )
      );
    } catch (err) {
      console.error('Error updating stock:', err);
      // Revert the stock change in UI
      setUserListings(prev => [...prev]);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) {
      return;
    }

    try {
      await items.delete(id);
      setUserListings(listings => listings.filter(item => item.id !== id));
    } catch (err) {
      console.error('Error deleting listing:', err);
    }
  };

  if (error) {
    return (
      <div className={styles.container}>
        <NavigationDrawer />
        <main className={styles.main}>
          <div className={styles.error}>{error}</div>
        </main>
      </div>
    );
  }

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

        {loading ? (
          <div className={styles.loading}>Loading your listings...</div>
        ) : (
          <>
            <div className={styles.stats}>
              <div className={styles.statCard}>
                <i className="fas fa-tag"></i>
                <h3>Active Listings</h3>
                <p>{userListings.filter(item => item.listing_status === 'active').length}</p>
              </div>
              <div className={styles.statCard}>
                <i className="fas fa-eye"></i>
                <h3>Total Views</h3>
                <p>{userListings.reduce((sum, item) => sum + (item.views || 0), 0)}</p>
              </div>
              <div className={styles.statCard}>
                <i className="fas fa-user-friends"></i>
                <h3>Interested Buyers</h3>
                <p>{userListings.reduce((sum, item) => sum + (item.interested || 0), 0)}</p>
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
                      <img 
                        src={listing.photo_urls?.[0]?.photo_url || '/placeholder.jpg'} 
                        alt={listing.title} 
                        className={styles.itemImage} 
                      />
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
                      onChange={(e) => handleStockUpdate(listing.id, parseInt(e.target.value, 10))}
                    />
                  </div>
                  <div className={styles.tableCell}>
                    <span className={`${styles.status} ${styles[listing.listing_status]}`}>
                      {listing.listing_status}
                    </span>
                  </div>
                  <div className={styles.tableCell}>
                    <div className={styles.actions}>
                      <button className={styles.actionButton} onClick={() => {}}>
                        <i className="fas fa-edit"></i>
                      </button>
                      <button className={styles.actionButton} onClick={() => handleDelete(listing.id)}>
                        <i className="fas fa-trash"></i>
                      </button>
                      <button className={styles.actionButton} onClick={() => {}}>
                        <i className="fas fa-chart-line"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}