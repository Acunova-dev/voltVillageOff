"use client"
import React, { useState, useEffect } from 'react';
import styles from './page.module.css';
import NavigationDrawer from '../../components/NavigationDrawer';
import CreateRequestModal from '@/components/CreateRequestModal';
import LoadingSpinner from '@/components/LoadingSpinner';
import { requests } from '@/utils/api';

export default function Requests() {
  const [allRequests, setAllRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await requests.getAll();
      setAllRequests(response.data);
    } catch (err) {
      setError('Failed to load requests');
      console.error('Error fetching requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRequest = (newRequest) => {
    setAllRequests(prev => [newRequest, ...prev]);
  };

  const handleMakeOffer = async (requestId, offerAmount) => {
    try {
      await requests.makeOffer(requestId, { amount: offerAmount });
      // Refresh requests to get updated status
      fetchRequests();
    } catch (err) {
      console.error('Error making offer:', err);
      alert(err.response?.data?.message || 'Failed to make offer');
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <NavigationDrawer />
        <main className={styles.main}>
          <LoadingSpinner />
        </main>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <NavigationDrawer />
      
      <main className={styles.main}>
        <div className={styles.header}>
          <h1>Component Requests</h1>
          <button 
            className={styles.createButton}
            onClick={() => setShowCreateModal(true)}
          >
            + Post New Request
          </button>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.requestsGrid}>
          {allRequests.map((request) => (
            <div key={request.id} className={styles.requestCard}>
              <div className={styles.requestHeader}>
                <h3>{request.title}</h3>
                <span className={styles.budget}>${request.budget.toFixed(2)}</span>
              </div>
              
              <p className={styles.description}>{request.description}</p>
              
              <div className={styles.requestInfo}>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Posted by:</span>
                  <span>{request.user?.name || 'Unknown'}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Department:</span>
                  <span>{request.department}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.label}>Posted:</span>
                  <span>{new Date(request.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              <div className={styles.requestFooter}>
                <span className={`${styles.status} ${styles[request.status.toLowerCase()]}`}>
                  {request.status}
                </span>
                {request.status === 'Open' && (
                  <button 
                    className={styles.bidButton}
                    onClick={() => {
                      const amount = prompt('Enter your offer amount:');
                      if (amount && !isNaN(amount)) {
                        handleMakeOffer(request.id, parseFloat(amount));
                      }
                    }}
                  >
                    Make Offer
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {showCreateModal && (
          <CreateRequestModal
            onClose={() => setShowCreateModal(false)}
            onRequestCreated={handleCreateRequest}
          />
        )}
      </main>
    </div>
  );
}