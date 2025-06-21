"use client"
import { useEffect, useState } from 'react';
import styles from './page.module.css';
import NavigationDrawer from '@/components/NavigationDrawer';
import { FaSearch, FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import AddSellerModal from '@/components/AddSellerModal';
import EditSellerModal from '@/components/EditSellerModal';
import Link from 'next/link';
import { externalSellers } from '@/utils/api';

export default function ManageSellers() {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentSellerToEdit, setCurrentSellerToEdit] = useState(null);

  useEffect(() => {
    fetchSellers();
  }, []);

  const fetchSellers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await externalSellers.getAll({ skip: 0, limit: 100 });
      console.log('API Response:', response);
      console.log('Response type:', typeof response);
      console.log('Response.data type:', typeof response.data);
      console.log('Response.data:', response.data);
      
      // Ensure we're setting an array - handle different response structures
      const sellersData = Array.isArray(response.data) ? response.data : 
                         Array.isArray(response) ? response : [];
      
      console.log('Processed sellersData:', sellersData);
      setSellers(sellersData);
      setError(null);
    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.message || 'An unexpected error occurred while fetching sellers';
      setError(errorMsg);
      console.error('Error fetching sellers:', err);
      // Ensure sellers is still an array even on error
      setSellers([]);
    } finally {
      setLoading(false);
    }
  };

  // Ensure sellers is always an array before filtering
  const filteredSellers = Array.isArray(sellers) ? sellers.filter(seller =>
    seller.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    seller.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    seller.phone?.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  const handleAddSeller = () => {
    setError(null);
    setShowAddModal(true);
  };

  const handleAddSellerSubmit = async (newSeller) => {
    try {
      // Refetch sellers from server to get the most up-to-date data
      await fetchSellers();
      alert('Seller added successfully');
      setError(null);
    } catch (err) {
      console.error('Error refreshing sellers after add:', err);
      // Fallback to local state update if refetch fails
      setSellers(prevSellers => [...prevSellers, newSeller]);
      alert('Seller added successfully');
      setError(null);
    }
  };

  const handleEditSeller = (seller) => {
    setError(null);
    setCurrentSellerToEdit(seller);
    setShowEditModal(true);
  };

  const handleEditSellerSubmit = async (updatedSeller) => {
    try {
      // Refetch sellers from server to get the most up-to-date data
      await fetchSellers();
      alert('Seller updated successfully');
      setError(null);
    } catch (err) {
      console.error('Error refreshing sellers after edit:', err);
      // Fallback to local state update if refetch fails
      setSellers(prevSellers => 
        prevSellers.map(seller => 
          seller.id === updatedSeller.id ? updatedSeller : seller
        )
      );
      alert('Seller updated successfully');
      setError(null);
    }
  };

  const handleDeleteSeller = async (seller) => {
    try {
      if (!window.confirm('Are you sure you want to delete this seller?')) {
        return;
      }
      setError(null);

      await externalSellers.delete(seller.id);
      setSellers(prevSellers => prevSellers.filter(s => s.id !== seller.id));
      alert('Seller deleted successfully');
      setError(null);
    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.message || 'An unexpected error occurred while deleting seller';
      setError(errorMsg);
      console.error('Error deleting seller:', err);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <NavigationDrawer />
        <main className={styles.main}>
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading sellers...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <NavigationDrawer />
      <main className={styles.main}>
        <div className={styles.header}>
          <h1>Manage External Sellers</h1>
          <button className={styles.addButton} onClick={handleAddSeller}>
            <FaPlus /> Add New Seller
          </button>
        </div>

        <div className={styles.searchBar}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search sellers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>

        {error && (
          <div className={styles.error}>
            <i className="fas fa-exclamation-circle"></i>
            <span>{error}</span>
          </div>
        )}

        <div className={styles.sellersGrid}>
          {filteredSellers.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No sellers found</p>
            </div>
          ) : (
            filteredSellers.map((seller) => (
              <Link key={seller.id} href={`/manage-sellers/${seller.id}/items`} className={styles.sellerCardLink}>
                <div className={styles.sellerCard}>
                  <div className={styles.sellerHeader}>
                    <div className={styles.sellerAvatar}>
                      {seller.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className={styles.sellerInfo}>
                      <h3>{seller.name}</h3>
                      <p className={styles.listedBy}>
                        Listed by: {seller.listed_by?.name} {seller.listed_by?.surname}
                      </p>
                    </div>
                  </div>
                  
                  <div className={styles.sellerDetails}>
                    {seller.email && (
                      <p className={styles.detail}>
                        <i className="fas fa-envelope"></i> {seller.email}
                      </p>
                    )}
                    {seller.phone && (
                      <p className={styles.detail}>
                        <i className="fas fa-phone"></i> {seller.phone}
                      </p>
                    )}
                    {seller.address && (
                      <p className={styles.detail}>
                        <i className="fas fa-map-marker-alt"></i> {seller.address}
                      </p>
                    )}
                    {seller.notes && (
                      <p className={styles.detail}>
                        <i className="fas fa-sticky-note"></i> {seller.notes}
                      </p>
                    )}
                  </div>

                  <div className={styles.sellerActions}>
                    <button 
                      className={styles.editButton}
                      onClick={(e) => { e.preventDefault(); handleEditSeller(seller); }}
                    >
                      <FaEdit /> Edit
                    </button>
                    <button 
                      className={styles.deleteButton}
                      onClick={(e) => { e.preventDefault(); handleDeleteSeller(seller); }}
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        {showAddModal && (
          <AddSellerModal
            onClose={() => setShowAddModal(false)}
            onSubmit={handleAddSellerSubmit}
          />
        )}

        {showEditModal && currentSellerToEdit && (
          <EditSellerModal
            seller={currentSellerToEdit}
            onClose={() => setShowEditModal(false)}
            onSubmit={handleEditSellerSubmit}
          />
        )}
      </main>
    </div>
  );
}