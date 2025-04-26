'use client';

import React from 'react';
import styles from './LoadingSpinner.module.css';

const LoadingSpinner = ({ fullScreen }) => {
  return (
    <div className={`${styles.spinnerContainer} ${fullScreen ? styles.fullScreen : ''}`}>
      <div className={styles.spinner}></div>
      <p className={styles.loadingText}>Loading...</p>
    </div>
  );
};

export default LoadingSpinner;