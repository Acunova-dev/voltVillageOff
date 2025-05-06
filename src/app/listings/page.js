"use client"
import React, { useState, useEffect, Suspense, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import styles from './page.module.css';
import NavigationDrawer from '../../components/NavigationDrawer';
import InteractiveListingCard from '../../components/InteractiveListingCard';
import CreateListingModal from '../../components/CreateListingModal';
import LoadingSpinner from '@/components/LoadingSpinner';
import { items } from '@/utils/api';

function ListingsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    condition: '',
    sort: 'recent'
  });

  const fetchListings = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        ...(filters.category && { category: filters.category }),
        ...(filters.condition && { condition: filters.condition }),
        ...(filters.sort === 'price-low' && { sort: 'price_asc' }),
        ...(filters.sort === 'price-high' && { sort: 'price_desc' }),
        ...(searchQuery && { search: searchQuery })
      };
      const response = await items.getAll(params);
      // API returns array directly
      setListings(Array.isArray(response) ? response : []);
    } catch (err) {
      setError('Failed to load listings');
      console.error('Error fetching listings:', err);
      setListings([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  }, [filters, searchQuery]);

  useEffect(() => {
    fetchListings();
  }, [fetchListings]);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const handleCreateListing = async (formData) => {
    try {
      const response = await items.create(formData);
      // Assuming the API returns the created listing directly
      const newListing = response.data || response;
      setListings(prev => [newListing, ...prev]);
      return response;
    } catch (err) {
      console.error('Error creating listing:', err);
      throw new Error(err.response?.data?.message || 'Failed to create listing');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    router.push(`/listings${query ? `?search=${encodeURIComponent(query)}` : ''}`);
  };

  return (
    <div className={styles.container}>
      <NavigationDrawer />
      
      <main className={styles.main}>
        <div className={styles.header}>
          <h1>All Listings</h1>
          <button className={styles.createButton} onClick={() => setShowCreateModal(true)}>
            + Create New Listing
          </button>
        </div>

        <form onSubmit={handleSearch} className={styles.searchBar}>
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search listings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchButton}>
            Search
          </button>
        </form>

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
            <option value="sensors">Sensors</option>
            <option value="motors">Motors</option>
          </select>

          <select 
            className={styles.filterSelect}
            value={filters.condition}
            onChange={(e) => handleFilterChange('condition', e.target.value)}
          >
            <option value="">All Conditions</option>
            <option value="new">New</option>
            <option value="like_new">Like New</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
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
          <LoadingSpinner />
        ) : listings.length > 0 ? (
          <div className={styles.grid}>
            {listings.map((listing) => (
              <InteractiveListingCard 
                key={listing.id} 
                item={listing}
              />
            ))}
          </div>
        ) : (
          <div className={styles.noResults}>
            <i className="fas fa-search"></i>
            <p>No listings found</p>
            {searchQuery && <p>Try adjusting your search terms or filters</p>}
          </div>
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

export default function Listings() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ListingsContent />
    </Suspense>
  );
}