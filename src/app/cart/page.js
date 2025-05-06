"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import styles from './page.module.css';
import NavigationDrawer from '../../components/NavigationDrawer';

export default function Cart() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      title: 'Arduino Uno',
      price: 25.99,
      quantity: 2,
      seller: 'John Doe',
      image: '/placeholder.jpg',
      stock: 5
    },
    {
      id: 2,
      title: 'Raspberry Pi 4',
      price: 45.99,
      quantity: 1,
      seller: 'Alice Smith',
      image: '/placeholder.jpg',
      stock: 3
    }
  ]);

  const updateQuantity = (id, newQuantity) => {
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: Math.min(newQuantity, item.stock) } : item
    ));
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className={styles.container}>
      <NavigationDrawer />
      
      <main className={styles.main}>
        <h1 className={styles.title}>Shopping Cart</h1>

        <div className={styles.cartContent}>
          <div className={styles.cartItems}>
            {cartItems.map((item) => (
              <div key={item.id} className={styles.cartItem}>
                <Image 
                  src={item.image} 
                  alt={item.title} 
                  className={styles.itemImage}
                  width={100}
                  height={100} 
                />
                
                <div className={styles.itemDetails}>
                  <h3>{item.title}</h3>
                  <p className={styles.seller}>
                    <i className="fas fa-user"></i> Sold by {item.seller}
                  </p>
                  <p className={styles.stock}>
                    <i className="fas fa-box"></i> {item.stock} available
                  </p>
                </div>

                <div className={styles.quantity}>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className={styles.quantityButton}
                  >
                    <i className="fas fa-minus"></i>
                  </button>
                  <span>{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    disabled={item.quantity >= item.stock}
                    className={styles.quantityButton}
                  >
                    <i className="fas fa-plus"></i>
                  </button>
                </div>

                <div className={styles.price}>
                  ${(item.price * item.quantity).toFixed(2)}
                </div>

                <button 
                  onClick={() => removeItem(item.id)}
                  className={styles.removeButton}
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            ))}
          </div>

          <div className={styles.cartSummary}>
            <h2>Cart Summary</h2>
            <div className={styles.summaryItem}>
              <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <button className={styles.checkoutButton}>
              <i className="fas fa-comments"></i> Contact Sellers
            </button>
            <p className={styles.note}>
              <i className="fas fa-info-circle"></i>
              You&apos;ll be able to message the sellers to arrange payment and pickup/delivery.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}