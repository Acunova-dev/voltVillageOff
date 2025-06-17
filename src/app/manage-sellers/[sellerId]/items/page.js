"use client"
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import styles from './page.module.css';
import NavigationDrawer from '@/components/NavigationDrawer';
import { FaArrowLeft, FaPlus, FaEdit, FaTrash, FaUndo, FaTrashAlt } from 'react-icons/fa';
import AddExtSellerItemModal from '@/components/AddExtSellerItemModal';
import EditExtSellerItemModal from '@/components/EditExtSellerItemModal';
import { externalSellers, items as itemsAPI } from '@/utils/api';

export default function SellerItemsPage() {
  const params = useParams();
  const router = useRouter();
  const sellerId = params.sellerId;
  const [sellerItems, setSellerItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sellerName, setSellerName] = useState('Seller');
  const [externalSeller, setExternalSeller] = useState(null);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [showEditItemModal, setShowEditItemModal] = useState(false);
  const [currentItemToEdit, setCurrentItemToEdit] = useState(null);
  const [deletingItemId, setDeletingItemId] = useState(null);

  // Separate active and deleted items
  const activeItems = Array.isArray(sellerItems) ? sellerItems.filter(item => !item.is_deleted) : [];
  const deletedItems = Array.isArray(sellerItems) ? sellerItems.filter(item => item.is_deleted) : [];

  useEffect(() => {
    if (sellerId) {
      fetchSellerItems();
    }
  }, [sellerId]);

  const fetchSellerItems = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await externalSellers.getItems(sellerId, { skip: 0, limit: 100 });
      // Ensure we're setting an array - handle different response structures
      const itemsData = Array.isArray(response.data) ? response.data : 
                       Array.isArray(response) ? response : [];
      
      setSellerItems(itemsData);
      if (itemsData.length > 0) {
        if (itemsData[0].seller && itemsData[0].seller.name) {
          setSellerName(itemsData[0].seller.name);
        }
        if (itemsData[0].external_seller) {
          setExternalSeller(itemsData[0].external_seller);
        }
      }
      setError(null);
    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.message || 'An unexpected error occurred while fetching items';
      setError(errorMsg);
      console.error('Error fetching items:', err);
      // Ensure items is still an array even on error
      setSellerItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItemSubmit = async (newItem) => {
    try {
      // Refetch items from server to get the most up-to-date data
      await fetchSellerItems();
      alert('Item added successfully!');
      setError(null);
    } catch (err) {
      console.error('Error refreshing items after add:', err);
      // Fallback to local state update if refetch fails
      setSellerItems(prevItems => [...prevItems, newItem]);
      alert('Item added successfully!');
      setError(null);
    }
  };

  const handleEditItem = (item) => {
    setError(null);
    setCurrentItemToEdit(item);
    setShowEditItemModal(true);
  };

  const handleEditItemSubmit = async (updatedItem) => {
    try {
      // Refetch items from server to get the most up-to-date data
      await fetchSellerItems();
      alert('Item updated successfully!');
      setError(null);
    } catch (err) {
      console.error('Error refreshing items after edit:', err);
      // Fallback to local state update if refetch fails
      setSellerItems(prevItems => 
        prevItems.map(item => 
          item.id === updatedItem.id ? updatedItem : item
        )
      );
      alert('Item updated successfully!');
      setError(null);
    }
  };

  const handleDeleteItem = async (item) => {
    try {
      if (!window.confirm(`Are you sure you want to delete the item "${item.title}"?`)) {
        return;
      }
      setError(null);
      setDeletingItemId(item.id);

      await itemsAPI.delete(item.id);
      setSellerItems(prevItems => prevItems.filter(i => i.id !== item.id));
      setError(null);
      setDeletingItemId(null);
    } catch (err) {
      const errorMsg = err.response?.data?.detail || err.message || 'An unexpected error occurred while deleting item';
      setError(errorMsg);
      setDeletingItemId(null);
      console.error('Error deleting item:', err);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <NavigationDrawer />
        <main className={styles.main}>
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading seller items...</p>
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
          <button onClick={() => router.back()} className={styles.backButton}>
            <FaArrowLeft /> Back to Sellers
          </button>
          <div className={styles.sellerInfo}>
            <h1>Items by {sellerName}</h1>
            {externalSeller && (
              <div className={styles.externalSellerDetails}>
                <h3>External Seller: {externalSeller.name}</h3>
                <div className={styles.externalSellerInfo}>
                  <p><strong>Email:</strong> {externalSeller.email}</p>
                  <p><strong>Phone:</strong> {externalSeller.phone}</p>
                  <p><strong>Address:</strong> {externalSeller.address}</p>
                  {externalSeller.notes && (
                    <p><strong>Notes:</strong> {externalSeller.notes}</p>
                  )}
                </div>
              </div>
            )}
          </div>
          <button className={styles.addButton} onClick={() => setShowAddItemModal(true)}>
            <FaPlus /> Add New Item
          </button>
        </div>

        {error && (
          <div className={styles.error}>
            <i className="fas fa-exclamation-circle"></i>
            <span>{error}</span>
          </div>
        )}

        <div className={styles.itemsGrid}>
          {activeItems.length === 0 && deletedItems.length === 0 ? (
            <div className={styles.emptyState}>
              <p>No items found for this seller.</p>
            </div>
          ) : (
            <>
              {/* Active Items */}
              {activeItems.map((item) => (
                <div key={item.id} className={styles.itemCard}>
                  <img 
                    src={item.photo_urls[0]?.photo_url || '/placeholder-image.jpg'} 
                    alt={item.title}
                    className={styles.itemImage}
                  />
                  <div className={styles.itemInfo}>
                    <h3>{item.title}</h3>
                    <p className={styles.itemDescription}>{item.description}</p>
                    <div className={styles.itemPriceCategory}>
                      <span className={styles.itemPrice}>${item.price}</span>
                      <span className={styles.itemCategory}>{item.category}</span>
                    </div>
                    <div className={styles.itemDetails}>
                      <p>Location: {item.location}</p>
                      <p>Condition: {item.condition}</p>
                      <p>Quantity: {item.quantity}</p>
                    </div>
                    <div className={styles.itemActions}>
                      <button 
                        className={styles.editButton}
                        onClick={() => handleEditItem(item)}
                        disabled={deletingItemId === item.id}
                      >
                        <FaEdit /> Edit
                      </button>
                      <button 
                        className={styles.deleteButton}
                        onClick={() => handleDeleteItem(item)}
                        disabled={deletingItemId === item.id}
                      >
                        {deletingItemId === item.id ? (
                          <>
                            <div className={styles.spinner}></div>
                            Deleting...
                          </>
                        ) : (
                          <>
                            <FaTrash /> Delete
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Deleted Items Section */}
              {/* {deletedItems.length > 0 && (
                <div className={styles.deletedSection}>
                  <h2 className={styles.deletedSectionTitle}>Deleted Items</h2>
                  <div className={styles.deletedItemsGrid}>
                    {deletedItems.map((item) => (
                      <div key={item.id} className={`${styles.itemCard} ${styles.deletedItem}`}>
                        <img 
                          src={item.photo_urls[0]?.photo_url || '/placeholder-image.jpg'} 
                          alt={item.title}
                          className={styles.itemImage}
                        />
                        <div className={styles.itemInfo}>
                          <h3>{item.title}</h3>
                          <p className={styles.itemDescription}>{item.description}</p>
                          <div className={styles.itemPriceCategory}>
                            <span className={styles.itemPrice}>${item.price}</span>
                            <span className={styles.itemCategory}>{item.category}</span>
                          </div>
                          <div className={styles.itemDetails}>
                            <p>Location: {item.location}</p>
                            <p>Condition: {item.condition}</p>
                            <p>Quantity: {item.quantity}</p>
                          </div>
                          <div className={styles.deletedItemBadge}>
                            <span>Deleted</span>
                          </div>
                          <div className={styles.itemActions}>
                            <button 
                              className={styles.editButton}
                              onClick={() => handleEditItem(item)}
                              disabled={deletingItemId === item.id}
                            >
                              <FaEdit /> Restore
                            </button>
                            <button 
                              className={styles.deleteButton}
                              onClick={() => handleDeleteItem(item)}
                              disabled={deletingItemId === item.id}
                            >
                              {deletingItemId === item.id ? (
                                <>
                                  <div className={styles.spinner}></div>
                                  Deleting...
                                </>
                              ) : (
                                <>
                                  <FaTrash /> Delete Permanently
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )} */}
            </>
          )}
        </div>

        {showAddItemModal && (
          <AddExtSellerItemModal
            sellerId={sellerId}
            onClose={() => setShowAddItemModal(false)}
            onSubmit={handleAddItemSubmit}
          />
        )}

        {showEditItemModal && currentItemToEdit && (
          <EditExtSellerItemModal
            item={currentItemToEdit}
            onClose={() => setShowEditItemModal(false)}
            onSubmit={handleEditItemSubmit}
          />
        )}
      </main>
    </div>
  );
} 