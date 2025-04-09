"use client"
import React from 'react';
import styles from './page.module.css';
import NavigationDrawer from '../components/NavigationDrawer';
import InteractiveListingCard from '../components/InteractiveListingCard';

export default function Home() {
  // Mock data for featured listings
  const featuredListings = [
    {
      title: 'Arduino Uno',
      price: 25.99,
      description: 'Brand new Arduino Uno R3 board, perfect for electronics projects.',
      image: '/placeholder.jpg',
      location: 'Engineering Building',
      condition: 'New',
      category: 'Microcontrollers'
    },
    {
      title: 'Raspberry Pi 4',
      price: 45.99,
      description: '4GB RAM model, barely used, comes with case and power supply.',
      image: '/placeholder.jpg',
      location: 'Computer Lab',
      condition: 'Used - Like New',
      category: 'Single Board Computers'
    }
  ];

  return (
    <div className={styles.container}>
      <NavigationDrawer />
      
      <main className={styles.main}>
        <h1 className={styles.title}>Welcome to voltVillage</h1>
        <p className={styles.description}>
          Your marketplace for engineering components
        </p>

        <div className={styles.searchSection}>
          <input 
            type="text" 
            placeholder="Search for components..."
            className={styles.searchInput}
          />
          <button className={styles.searchButton}>Search</button>
        </div>

        <section className={styles.featuredSection}>
          <h2>Featured Listings</h2>
          <div className={styles.grid}>
            {featuredListings.map((listing, index) => (
              <InteractiveListingCard key={index} item={listing} />
            ))}
          </div>
        </section>

        <section className={styles.categoriesSection}>
          <h2>Browse Categories</h2>
          <div className={styles.categoryGrid}>
            <div className={styles.categoryCard}>Microcontrollers</div>
            <div className={styles.categoryCard}>Components</div>
            <div className={styles.categoryCard}>Test Equipment</div>
            <div className={styles.categoryCard}>Tools</div>
          </div>
        </section>
      </main>
    </div>
  );
}
