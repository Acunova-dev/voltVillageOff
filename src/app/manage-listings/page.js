"use client"
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from './page.module.css';
import NavigationDrawer from '../../components/NavigationDrawer';
import CreateListingModal from '../../components/CreateListingModal';
import { items } from '../../utils/api';
import { useRouter } from 'next/navigation';

export default function ManageListings() {
  const [userListings, setUserListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const router = useRouter();
  const [filters, setFilters] = useState({
    category: '',
    condition: '',
    sort: 'recent'
  });

  useEffect(() => {
    fetchUserListings();
  }, []);

  useEffect(() => {
    let result = [...userListings];

    if (filters.category) {
      result = result.filter(item => item.category === filters.category);
    }

    if (filters.condition) {
      result = result.filter(item => item.condition === filters.condition);
    }

    switch (filters.sort) {
      case 'price-low':
        result.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
        break;
      case 'price-high':
        result.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
        break;
      default:
        result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    }

    setFilteredListings(result);
  }, [filters, userListings]);

  const fetchUserListings = async () => {
    try {
      setLoading(true);
      const response = await items.getMyItems();
      const listingsData = response.data || response || [];
      const listings = Array.isArray(listingsData) ? listingsData : [];
      setUserListings(listings);
      setFilteredListings(listings);
    } catch (err) {
      setError('Failed to load your listings');
      console.error('Error fetching user listings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
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

  const handleCreateListing = async (formData) => {
    try {
      const response = await items.create(formData);
      const newListing = response.data;
      setUserListings(prev => [newListing, ...prev]);
      return response;
    } catch (err) {
      console.error('Error creating listing:', err);
      throw new Error(err.response?.data?.message || 'Failed to create listing');
    }
  };

  const handleButtonClick = () => {
    console.log('Create button clicked');
    setShowCreateModal(true);
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
          <button className={styles.createButton} onClick={handleButtonClick}>
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

            <div className={styles.filters}>
              <select 
                className={styles.filterSelect}
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
              >
                <option value="">All Categories</option>
                <option value="microcontrollers">Microcontrollers</option>
                <option value="components">Components</option>
                <option value="test-equipment">Test Equipment</option>
                <option value="tools">Tools</option>
              </select>

              <select 
                className={styles.filterSelect}
                value={filters.condition}
                onChange={(e) => handleFilterChange('condition', e.target.value)}
              >
                <option value="">All Conditions</option>
                <option value="new">New</option>
                <option value="like-new">Used - Like New</option>
                <option value="good">Used - Good</option>
                <option value="fair">Used - Fair</option>
              </select>

              <select 
                className={styles.filterSelect}
                value={filters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
              >
                <option value="recent">Most Recent</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            <div className={styles.listingsTable}>
              <div className={styles.tableHeader}>
                <div className={styles.tableCell}>Item</div>
                <div className={styles.tableCell}>Price</div>
                <div className={styles.tableCell}>Stock</div>
                <div className={styles.tableCell}>Status</div>
                <div className={styles.tableCell}>Actions</div>
              </div>

              {filteredListings.map((listing) => (
                <div key={listing.id} className={styles.tableRow}>
                  <div className={styles.tableCell}>
                    <div className={styles.itemInfo}>
                      <Image 
                        src={listing.photo_urls?.[0]?.photo_url || '/placeholder.jpg'} 
                        alt={listing.title} 
                        className={styles.itemImage}
                        width={60}
                        height={60}
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
                      value={listing.stock || 0} 
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

        {showCreateModal && (
          <CreateListingModal
            onClose={() => setShowCreateModal(false)}
            onSubmit={handleCreateListing}
          />
        )}
      </main>
    </div>
  );
}