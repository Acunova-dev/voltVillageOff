"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import styles from './NavigationDrawer.module.css';

const NavigationDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button className={styles.menuButton} onClick={() => setIsOpen(!isOpen)}>
        ☰
      </button>
      <nav className={`${styles.drawer} ${isOpen ? styles.open : ''}`}>
        <div className={styles.closeButton} onClick={() => setIsOpen(false)}>×</div>
        <div className={styles.drawerContent}>
          <Link href="/" className={styles.link}>Home</Link>
          <Link href="/profile" className={styles.link}>Profile</Link>
          <Link href="/listings" className={styles.link}>Listings</Link>
          <Link href="/requests" className={styles.link}>Requests</Link>
          <Link href="/messages" className={styles.link}>Messages</Link>
        </div>
      </nav>
      {isOpen && <div className={styles.overlay} onClick={() => setIsOpen(false)} />}
    </>
  );
};

export default NavigationDrawer; 