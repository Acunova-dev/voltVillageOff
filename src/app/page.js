"use client"
import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import NavigationDrawer from '../components/NavigationDrawer';
import InteractiveListingCard from '../components/InteractiveListingCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { items } from '@/utils/api';
import { useRouter } from 'next/navigation';
import { useAuth } from './context/AuthContext';

export default function MainHome() {
  const [featuredListings, setFeaturedListings] = useState([]);
  const [listingsLoading, setListingsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();
  const { user, isLoading, isInitialized } = useAuth();

  useEffect(() => {
    if (isInitialized && !isLoading && !user) {
      router.push('/SignIn');
      return;
    }

    if (user) {
      fetchFeaturedListings();
    }
  }, [user, isLoading, isInitialized, router]);

  const fetchFeaturedListings = async () => {
    try {
      setListingsLoading(true);
      const data = await items.getAll({ limit: 10, listing_status: 'active' });
      setFeaturedListings(data || []);
    } catch (err) {
      setError('Failed to load featured listings');
      console.error('Error fetching featured listings:', err);
      setFeaturedListings([]);
    } finally {
      setListingsLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/listings?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleCreateListing = () => {
    router.push('/manage-listings');
  };

  // Show loading spinner only during initial auth check
  if (!isInitialized || isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  // If not authenticated and initialization is complete, return null (redirect will happen)
  if (!user) {
    return null;
  }

  return (
    <div className={styles.container}>
      <NavigationDrawer />
      
      <main className={styles.main}>
        <section className={styles.heroSection}>
          <div className={styles.heroContent}>
            <h1 className={styles.title}>Welcome to voltVillage</h1>
            <p className={styles.description}>
              Your marketplace for engineering components
            </p>

            <form onSubmit={handleSearch} className={styles.searchSection}>
              <div className={styles.searchWrapper}>
                <i className="fas fa-search"></i>
                <input 
                  type="text" 
                  placeholder="Search for components, tools, or equipment..."
                  className={styles.searchInput}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button type="submit" className={styles.searchButton}>
                <span>Search</span>
                <i className="fas fa-arrow-right"></i>
              </button>
            </form>

            {/* Categories section */}
            <div className={styles.categoryPills}>
              <div 
                className={styles.categoryPill}
                onClick={() => router.push('/listings?category=microcontrollers')}
              >
                <i className="fas fa-microchip"></i>
                <span>Microcontrollers</span>
              </div>
              <div 
                className={styles.categoryPill}
                onClick={() => router.push('/listings?category=components')}
              >
                <i className="fas fa-cogs"></i>
                <span>Components</span>
              </div>
              <div 
                className={styles.categoryPill}
                onClick={() => router.push('/listings?category=test-equipment')}
              >
                <i className="fas fa-tachometer-alt"></i>
                <span>Test Equipment</span>
              </div>
              <div 
                className={styles.categoryPill}
                onClick={() => router.push('/listings?category=tools')}
              >
                <i className="fas fa-tools"></i>
                <span>Tools</span>
              </div>
            </div>

            <div className={styles.heroFeatures}>
              <div className={styles.featureItem}>
                <i className="fas fa-microchip"></i>
                <span>Quality Components</span>
              </div>
              <div className={styles.featureItem}>
                <i className="fas fa-tools"></i>
                <span>Test Equipment</span>
              </div>
              <div className={styles.featureItem}>
                <i className="fas fa-shield-alt"></i>
                <span>Verified Sellers</span>
              </div>
            </div>
          </div>

          <div className={styles.heroVisuals}>
            <div className={styles.circuitOverlay}></div>
            <div className={styles.glowingOrbs}></div>
          </div>
        </section>

        {/* New Seller Section with CTA */}
        <section className={styles.sellerSection}>
          <div className={styles.sellerContent}>
            <h2>Have Engineering Components to Sell?</h2>
            <p>Join our community of trusted sellers and reach thousands of engineers and makers.</p>
            {/* <ul className={styles.sellerBenefits}>
              <li><i className="fas fa-check-circle"></i> Quick listing process</li>
              <li><i className="fas fa-check-circle"></i> Reach targeted buyers</li>
              <li><i className="fas fa-check-circle"></i> Secure payment system</li>
              <li><i className="fas fa-check-circle"></i> Seller dashboard analytics</li>
            </ul> */}
            <button onClick={handleCreateListing} className={styles.ctaButton}>
              <i className="fas fa-plus-circle"></i> List Your Product
            </button>
          </div>
          <div className={styles.sellerImage}>
            {/* This would be replaced with an actual image in your CSS */}
            <div className={styles.sellerGraphic}></div>
          </div>
        </section>

        <section className={styles.featuredSection}>
          <h2>Featured Listings</h2>
          {error && <div className={styles.error}>{error}</div>}
          {listingsLoading ? (
            <LoadingSpinner />
          ) : (
            <div className={styles.grid}>
              {featuredListings.map((listing) => (
                <InteractiveListingCard 
                  key={listing.id} 
                  item={listing}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}