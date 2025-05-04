'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../app/context/AuthContext';
import { useRouter } from 'next/navigation';
import styles from './NavigationDrawer.module.css';

const NavigationDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/SignIn');
  };

  return (
    <>
      <nav className={styles.navbar} style={{ backgroundColor: 'black', color: 'grey'}}>
        <div className={styles.navContent}>
          <Link href="/" className={styles.logo}>
            voltVillage
          </Link>

          {/* Desktop Navigation */}
          <div className={styles.desktopNav}>
            <Link href="/" className={styles.navLink}>
              <i className="fas fa-home"></i> Home
            </Link>
            <Link href="/listings" className={styles.navLink}>
              <i className="fas fa-tags"></i> Listings
            </Link>
            {user && (
              <>
                <Link href="/manage-listings" className={styles.navLink}>
                  <i className="fas fa-cogs"></i> Manage Listings
                </Link>
                <Link href="/requests" className={styles.navLink}>
                  <i className="fas fa-bullhorn"></i> Requests
                </Link>
                <Link href="/messages" className={styles.navLink}>
                  <i className="fas fa-envelope"></i> Messages
                </Link>
                <Link href="/cart" className={styles.navLink}>
                  <i className="fas fa-shopping-cart"></i> Cart
                </Link>
                <Link href="/profile" className={styles.navLink}>
                  <i className="fas fa-user"></i> Profile
                </Link>
              </>
            )}
            {user ? (
              <button onClick={handleLogout} className={styles.logoutButton}>
                Logout
              </button>
            ) : (
              <button onClick={() => router.push('/SignIn')} className={styles.loginButton}>
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className={styles.menuButton} 
            onClick={() => setIsOpen(!isOpen)}
          >
            <i className="fas fa-bars"></i>
          </button>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      <div className={`${styles.mobileNav} ${isOpen ? styles.open : ''}`}>
        <div className={styles.mobileHeader}>
          <span>Menu</span>
          <button 
            className={styles.closeButton} 
            onClick={() => setIsOpen(false)}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        <div className={styles.mobileLinks}>
          <Link href="/" className={styles.mobileLink} onClick={() => setIsOpen(false)}>
            <i className="fas fa-home"></i> Home
          </Link>
          <Link href="/listings" className={styles.mobileLink} onClick={() => setIsOpen(false)}>
            <i className="fas fa-tags"></i> Listings
          </Link>
          {user && (
            <>
              <Link href="/manage-listings" className={styles.mobileLink} onClick={() => setIsOpen(false)}>
                <i className="fas fa-cogs"></i> Manage Listings
              </Link>
              <Link href="/requests" className={styles.mobileLink} onClick={() => setIsOpen(false)}>
                <i className="fas fa-bullhorn"></i> Requests
              </Link>
              <Link href="/messages" className={styles.mobileLink} onClick={() => setIsOpen(false)}>
                <i className="fas fa-envelope"></i> Messages
              </Link>
              <Link href="/cart" className={styles.mobileLink} onClick={() => setIsOpen(false)}>
                <i className="fas fa-shopping-cart"></i> Cart
              </Link>
              <Link href="/profile" className={styles.mobileLink} onClick={() => setIsOpen(false)}>
                <i className="fas fa-user"></i> Profile
              </Link>
            </>
          )}
          {user ? (
            <button onClick={handleLogout} className={styles.mobileLogoutButton}>
              Logout
            </button>
          ) : (
            <button onClick={() => { setIsOpen(false); router.push('/SignIn'); }} className={styles.mobileLoginButton}>
              Sign In
            </button>
          )}
        </div>
      </div>

      {/* Overlay for mobile menu */}
      {isOpen && (
        <div 
          className={styles.overlay} 
          onClick={() => setIsOpen(false)} 
        />
      )}
    </>
  );
};

export default NavigationDrawer;