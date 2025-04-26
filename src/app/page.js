"use client"
import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import NavigationDrawer from '../components/NavigationDrawer';
import InteractiveListingCard from '../components/InteractiveListingCard';
import { items } from '@/utils/api';
import { useRouter } from 'next/navigation';

export default function MainHome() {
  const [featuredListings, setFeaturedListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchFeaturedListings();
  }, []);

  const fetchFeaturedListings = async () => {
    try {
      setLoading(true);
      // Get first 4 active listings for featured section
      const data = await items.getAll({ limit: 4, listing_status: 'active' });
      setFeaturedListings(data);
    } catch (err) {
      setError('Failed to load featured listings');
      console.error('Error fetching featured listings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/listings?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className={styles.container}>
      <NavigationDrawer />
      
      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to voltVillage</h1>
        <p className={styles.description}>
          Your marketplace for engineering components
        </p>

        <form onSubmit={handleSearch} className={styles.searchSection}>
          <input 
            type="text" 
            placeholder="Search for components..."
            className={styles.searchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className={styles.searchButton}>Search</button>
        </form>

        <section className={styles.featuredSection}>
          <h2>Featured Listings</h2>
          {error && <div className={styles.error}>{error}</div>}
          {loading ? (
            <div className={styles.loading}>Loading featured listings...</div>
          ) : (
            <div className={styles.grid}>
              {featuredListings.map((listing) => (
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
        </section>

        <section className={styles.categoriesSection}>
          <h2>Browse Categories</h2>
          <div className={styles.categoryGrid}>
            <div 
              className={styles.categoryCard}
              onClick={() => router.push('/listings?category=microcontrollers')}
            >
              Microcontrollers
            </div>
            <div 
              className={styles.categoryCard}
              onClick={() => router.push('/listings?category=components')}
            >
              Components
            </div>
            <div 
              className={styles.categoryCard}
              onClick={() => router.push('/listings?category=test-equipment')}
            >
              Test Equipment
            </div>
            <div 
              className={styles.categoryCard}
              onClick={() => router.push('/listings?category=tools')}
            >
              Tools
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
