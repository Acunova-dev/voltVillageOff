"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from './InteractiveListingCard.module.css';

const InteractiveListingCard = ({ item }) => {
  const [expanded, setExpanded] = useState(false);
  const router = useRouter();

  const defaultItem = {
    title: 'Arduino Uno',
    price: 25.99,
    description: 'Brand new Arduino Uno R3 board.',
    photo_urls: [],
    location: 'Engineering Building',
    condition: 'New',
    category: 'Microcontrollers',
    seller: {
      name: 'Unknown',
      surname: 'Seller'
    }
  };

  const displayItem = item || defaultItem;
  const imageUrl = displayItem.photo_urls?.[0]?.photo_url || '/placeholder.jpg';
  const formattedCondition = displayItem.condition?.replace(/_/g, ' ') || 'Not specified';
  const formattedCategory = displayItem.category?.replace(/_/g, ' ') || 'Other';
  const formattedDate = new Date(displayItem.created_at).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });

  const handleContact = (e) => {
    e.stopPropagation();
    if (displayItem.seller_id) {
      router.push(`/messages?seller=${displayItem.seller_id}`);
    }
  };

  return (
    <div 
      className={`${styles.card} ${expanded ? styles.expanded : ''}`}
      onClick={() => setExpanded(!expanded)}
    >
      <div className={styles.imageContainer}>
        <Image
          src={imageUrl}
          alt={displayItem.title}
          width={200}
          height={200}
          className={styles.image}
          style={{ objectFit: 'cover' }}
        />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{displayItem.title}</h3>
        <p className={styles.price}>${Number(displayItem.price).toFixed(2)}</p>
        
        {expanded && (
          <div className={styles.expandedContent}>
            <p className={styles.description}>{displayItem.description}</p>
            <div className={styles.details}>
              <span className={styles.location}>
                <i className="fas fa-map-marker-alt"></i> {displayItem.location}
              </span>
              <span className={styles.condition}>
                <i className="fas fa-star"></i> {formattedCondition}
              </span>
              <span className={styles.category}>
                <i className="fas fa-tags"></i> {formattedCategory}
              </span>
            </div>
            <div className={styles.additionalInfo}>
              <span className={styles.date}>
                <i className="fas fa-calendar"></i> {formattedDate}
              </span>
              {displayItem.total_bids > 0 && (
                <span className={styles.bids}>
                  <i className="fas fa-gavel"></i> {displayItem.total_bids} bids
                  {displayItem.current_highest_bid && (
                    <span className={styles.highestBid}>
                      <i className="fas fa-trophy"></i> ${displayItem.current_highest_bid}
                    </span>
                  )}
                </span>
              )}
            </div>
            <div className={styles.sellerInfo}>
              {displayItem.seller && (
                <p className={styles.sellerName}>
                  <i className="fas fa-user"></i> {displayItem.seller.name} {displayItem.seller.surname}
                </p>
              )}
              <button 
                className={styles.contactButton}
                onClick={handleContact}
              >
                <i className="fas fa-comments"></i> Contact Seller
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InteractiveListingCard;