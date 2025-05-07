"use client"
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from './InteractiveListingCard.module.css';

const InteractiveListingCard = ({ item }) => {
  const router = useRouter();

  const defaultItem = {
    title: 'Arduino Uno',
    price: 25.99,
    description: 'Brand new Arduino Uno R3 board.',
    photo_urls: [],
    location: 'Engineering Building',
    condition: 'New',
    category: 'Microcontrollers',
    id: 0,
    seller: {
      name: 'Unknown',
      surname: 'Seller'
    }
  };

  const displayItem = item || defaultItem;
  const imageUrl = displayItem.photo_urls?.[0]?.photo_url || '/placeholder.jpg';

  const handleCardClick = () => {
    // Navigate to product detail page
    router.push(`/listings/${displayItem.id}`);
  };

  return (
    <div 
      className={styles.card}
      onClick={handleCardClick}
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
      </div>
    </div>
  );
};

export default InteractiveListingCard;