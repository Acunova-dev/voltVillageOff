import React from 'react';
import styles from './page.module.css';
import NavigationDrawer from '../../components/NavigationDrawer';

export default function Requests() {
  // Mock data for requests
  const requests = [
    {
      id: 1,
      title: 'Looking for Arduino Mega',
      description: 'Need an Arduino Mega 2560 for final year project. Preferably new or lightly used.',
      budget: 35.00,
      postedBy: 'Alice Smith',
      department: 'Electrical Engineering',
      postedDate: '2024-04-05',
      status: 'Open'
    },
    {
      id: 2,
      title: 'Need Resistor Kit',
      description: 'Looking for a comprehensive resistor kit for electronics lab work.',
      budget: 15.00,
      postedBy: 'Bob Johnson',
      department: 'Electronics Engineering',
      postedDate: '2024-04-04',
      status: 'Open'
    }
  ];

  return (
    <div className={styles.container}>
      <NavigationDrawer />
      
      <main className={styles.main}>
        <div className={styles.header}>
          <h1>Component Requests</h1>
          <button className={styles.createButton}>+ Post New Request</button>
        </div>

        <div className={styles.requestsGrid}>
          {requests.map((request) => (
            <div key={request.id} className={styles.requestCard}>
              <div className={styles.requestHeader}>
                <h3>{request.title}</h3>
                <span className={styles.budget}>${request.budget.toFixed(2)}</span>
              </div>
              
              <p className={styles.description}>{request.description}</p>
              
              <div className={styles.requestInfo}>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Posted by:</span>
                  <span>{request.postedBy}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Department:</span>
                  <span>{request.department}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Posted:</span>
                  <span>{request.postedDate}</span>
                </div>
              </div>

              <div className={styles.requestFooter}>
                <span className={`${styles.status} ${styles.statusOpen}`}>
                  {request.status}
                </span>
                <button className={styles.bidButton}>
                  Make Offer
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
} 