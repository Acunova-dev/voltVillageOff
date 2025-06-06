"use client"
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from './InteractiveListingCard.module.css';
import { getCartItems } from '@/utils/cartStorage';

const InteractiveListingCard = ({ item }) => {
  const router = useRouter();
  const [isInCart, setIsInCart] = useState(false);

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
  useEffect(() => {
    const cartItems = getCartItems();
    setIsInCart(cartItems.some(cartItem => cartItem.id === displayItem.id));
  }, [displayItem.id]);

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
        {isInCart && (
          <div className={styles.pinIndicator}>
            <i className="fas fa-shopping-cart"></i>
          </div>
        )}
        <Image
          src={imageUrl}
          alt={displayItem.title}
          width={200}
          height={200}
          className={styles.image}
          style={{ objectFit: 'cover' }}
          unoptimized
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