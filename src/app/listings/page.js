"use client"
import React from 'react';
import styles from './page.module.css';
import NavigationDrawer from '../../components/NavigationDrawer';
import InteractiveListingCard from '../../components/InteractiveListingCard';

export default function Listings() {
  // Mock data for listings
  const listings = [
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
    },
    {
      title: 'Oscilloscope',
      price: 199.99,
      description: 'Digital oscilloscope, 100MHz bandwidth, excellent condition.',
      image: '/placeholder.jpg',
      location: 'Electronics Lab',
      condition: 'Used - Good',
      category: 'Test Equipment'
    }
  ];

  return (
    <div className={styles.container}>
      <NavigationDrawer />
      
      <main className={styles.main}>
        <div className={styles.header}>
          <h1>All Listings</h1>
          <button className={styles.createButton}>+ Create New Listing</button>
        </div>

        <div className={styles.filters}>
          <select className={styles.filterSelect}>
            <option value="">All Categories</option>
            <option value="microcontrollers">Microcontrollers</option>
            <option value="components">Components</option>
            <option value="test-equipment">Test Equipment</option>
            <option value="tools">Tools</option>
          </select>

          <select className={styles.filterSelect}>
            <option value="">All Conditions</option>
            <option value="new">New</option>
            <option value="like-new">Used - Like New</option>
            <option value="good">Used - Good</option>
            <option value="fair">Used - Fair</option>
          </select>

          <select className={styles.filterSelect}>
            <option value="recent">Most Recent</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>

        <div className={styles.grid}>
          {listings.map((listing, index) => (
            <InteractiveListingCard key={index} item={listing} />
          ))}
        </div>
      </main>
    </div>
  );
} 