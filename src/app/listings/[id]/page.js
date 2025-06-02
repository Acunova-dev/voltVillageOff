"use client"
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from './ListingDetail.module.css';
import NavigationDrawer from '../../../components/NavigationDrawer';
import { addToCart } from '../../../utils/cartStorage';
import { items } from '../../../utils/api';

const ListingDetail = ({ params }) => {
  const { id } = React.use(params);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await items.getById(id);
        setListing(response.data);
        console.log('Fetched listing:', response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (id) {
      fetchListing();
    }
  }, [id]);
  
  const handleAddToCart = () => {
    if (listing) {
      addToCart(listing);
      router.push('/cart');
    }
  };  const handleContact = async () => {
    if (listing && listing.seller_id) {
      // First add item to cart
      addToCart(listing);

      // Then prepare message data
      const userInfo = listing.seller;
      const userInfoStr = encodeURIComponent(JSON.stringify(userInfo));
      const itemLink = window.location.href;
      const price = Number(listing.price).toFixed(2);
      const condition = listing.condition?.replace(/_/g, ' ') || 'Not specified';
      const message = `Hi! I'm interested in the ${listing.title} you have listed for $${price}.\n\nItem Details:\n- Price: $${price}\n- Condition: ${condition}\n- Category: ${listing.category}\n- Location: ${listing.location}\n\nItem Link: ${itemLink}\n\nPlease let me know if it's still available.`;
      // Pass the message as a query param
      router.push(`/messages?seller=${listing.seller_id}&user=${userInfoStr}&message=${encodeURIComponent(message)}`);
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}>
          <div className={styles.spinner}></div>
          <p>Loading listing details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.error}>
          <i className="fas fa-exclamation-circle"></i>
          <h2>Oops! Something went wrong</h2>
          <p>{error}</p>
          <button onClick={handleBack} className={styles.returnButton}>
            Return to listings
          </button>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className={styles.notFoundContainer}>
        <div className={styles.notFound}>
          <i className="fas fa-search"></i>
          <h2>Listing Not Found</h2>
          <p>The listing you're looking for doesn't exist or has been removed.</p>
          <button onClick={handleBack} className={styles.returnButton}>
            Return to listings
          </button>
        </div>
      </div>
    );
  }

  const defaultImage = '/placeholder.jpg';
  const mainImageUrl = listing.photo_urls && listing.photo_urls.length > 0 
    ? listing.photo_urls[activeImage]?.photo_url || defaultImage 
    : defaultImage;
  
  const formattedCondition = listing.condition?.replace(/_/g, ' ') || 'Not specified';
  const formattedCategory = listing.category?.replace(/_/g, ' ') || 'Other';
  const formattedDate = new Date(listing.created_at).toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });

  return (
    <div className={styles.pageWrapper}>
      <NavigationDrawer />
      
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.backNavigation}>
            {/* <button onClick={handleBack} className={styles.backButton}>
              <i className="fas fa-arrow-left"></i> Back to listings
            </button> */}
          </div>
          
          <div className={styles.contentGrid}>
            <div className={styles.imageSection}>
              <div className={styles.mainImageContainer}>
                <Image
                  src={mainImageUrl}
                  alt={listing.title}
                  width={600}
                  height={600}
                  className={styles.mainImage}
                  unoptimized
                />
              </div>
              
              {listing.photo_urls && listing.photo_urls.length > 1 && (
                <div className={styles.thumbnailsContainer}>
                  {listing.photo_urls.map((photo, index) => (
                    <div 
                      key={index} 
                      className={`${styles.thumbnail} ${activeImage === index ? styles.activeThumbnail : ''}`}
                      onClick={() => setActiveImage(index)}
                    >
                      <Image 
                        src={photo.photo_url || defaultImage} 
                        alt={`${listing.title} - ${index + 1}`}
                        width={100}
                        height={100}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className={styles.detailsSection}>
              <div className={styles.headingSection}>
                <h1 className={styles.title}>{listing.title}</h1>
                <p className={styles.price}>${Number(listing.price).toFixed(2)}</p>
                <p className={styles.listingDate}>Listed on {formattedDate}</p>
              </div>
              
              <div className={styles.quickInfo}>
                <div className={styles.infoTag}>
                  <i className="fas fa-map-marker-alt"></i>
                  <span>{listing.location}</span>
                </div>
                <div className={styles.infoTag}>
                  <i className="fas fa-star"></i>
                  <span>{formattedCondition}</span>
                </div>
                <div className={styles.infoTag}>
                  <i className="fas fa-tags"></i>
                  <span>{formattedCategory}</span>
                </div>
              </div>
              
              <div className={styles.descriptionBox}>
                <h2>Description</h2>
                <p>{listing.description}</p>
              </div>
              
              <div className={styles.sellerCard}>
                <h3>Seller Information</h3>
                {listing.seller && (
                  <div className={styles.sellerInfo}>
                    <div className={styles.sellerAvatar}>
                      <span>{listing.seller.name.charAt(0)}{listing.seller.surname.charAt(0)}</span>
                    </div>
                    <div className={styles.sellerDetails}>
                      <h4>{listing.seller.name} {listing.seller.surname}</h4>
                      {listing.seller.email && (
                        <p className={styles.sellerContact}>
                          <i className="fas fa-envelope"></i>
                          <span>{listing.seller.email}</span>
                        </p>
                      )}
                      {listing.seller.phone_number && (
                        <p className={styles.sellerContact}>
                          <i className="fas fa-phone"></i>
                          <span>{listing.seller.phone_number}</span>
                        </p>
                      )}
                    </div>
                  </div>
                )}
                <button 
                  className={styles.contactButton}
                  onClick={handleContact}
                >
                  <i className="fas fa-shopping-cart"></i> I'm Interested
                </button>
              </div>
            </div>
          </div>
          
          <div className={styles.relatedSection}>
            <h2>You might also like</h2>
            <div className={styles.relatedPlaceholder}>
              <p>Related listings would appear here</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ListingDetail;