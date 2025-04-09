"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import styles from './InteractiveListingCard.module.css';

const InteractiveListingCard = ({ item }) => {
  const [expanded, setExpanded] = useState(false);

  const defaultItem = {
    title: 'Arduino Uno',
    price: 25.99,
    description: 'Brand new Arduino Uno R3 board, perfect for electronics projects.',
    image: '/placeholder.jpg',
    location: 'Engineering Building',
    condition: 'New',
    category: 'Microcontrollers'
  };

  const displayItem = item || defaultItem;

  return (
    <div 
      className={`${styles.card} ${expanded ? styles.expanded : ''}`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className={styles.imageContainer}>
        <Image
          src={displayItem.image}
          alt={displayItem.title}
          width={200}
          height={200}
          className={styles.image}
        />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{displayItem.title}</h3>
        <p className={styles.price}>${displayItem.price}</p>
        
        {expanded && (
          <div className={styles.expandedContent}>
            <p className={styles.description}>{displayItem.description}</p>
            <div className={styles.details}>
              <span className={styles.location}>📍 {displayItem.location}</span>
              <span className={styles.condition}>✨ {displayItem.condition}</span>
              <span className={styles.category}>📁 {displayItem.category}</span>
            </div>
            <button className={styles.contactButton}>
              Contact Seller
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractiveListingCard; 