"use client"
import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import NavigationDrawer from '../../components/NavigationDrawer';
import InteractiveListingCard from '../../components/InteractiveListingCard';
import { api } from '../../utils/api';

export default function Listings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    condition: '',
    sort: 'recent'
  });

  useEffect(() => {
    fetchListings();
  }, [filters]);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const params = {
        ...(filters.category && { category: filters.category }),
        ...(filters.condition && { condition: filters.condition }),
        ...(filters.sort === 'price-low' && { sort: 'price_asc' }),
        ...(filters.sort === 'price-high' && { sort: 'price_desc' })
      };
      const data = await api.items.getAll(params);
      setListings(data.data);
    } catch (err) {
      setError('Failed to load listings');
      console.error('Error fetching listings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className={styles.container}>
      <NavigationDrawer />
      
      <main className={styles.main}>
        <div className={styles.header}>
          <h1>All Listings</h1>
          <button className={styles.createButton}>+ Create New Listing</button>
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

        {error && <div className={styles.error}>{error}</div>}
        
        {loading ? (
          <div className={styles.loading}>Loading listings...</div>
        ) : (
          <div className={styles.grid}>
            {listings.map((listing) => (
              <InteractiveListingCard 
                key={listing.id} 
                item={{
                  ...listing,
                  condition: listing.condition || 'Not Specified',
                  category: listing.category || 'Other'
                }} 
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}