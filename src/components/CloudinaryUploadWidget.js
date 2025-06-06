"use client"
import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';

const CloudinaryUploadWidget = ({ uwConfig, onUploadSuccess, onUploadError }) => {
  const cloudinaryRef = useRef();
  const widgetRef = useRef();
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [scriptError, setScriptError] = useState(false);

  useEffect(() => {
    // Only initialize if the script has loaded successfully
    if (scriptLoaded && typeof window !== 'undefined' && window.cloudinary) {
      cloudinaryRef.current = window.cloudinary;
      
      // Create widget instance
      widgetRef.current = cloudinaryRef.current.createUploadWidget(
        {
          ...uwConfig,
          styles: {
            palette: {
              window: "#FFFFFF",
              windowBorder: "#90A0B3",
              tabIcon: "#4f46e5",
              menuIcons: "#5A616A",
              textDark: "#000000",
              textLight: "#FFFFFF",
              link: "#4f46e5",
              action: "#FF620C",
              inactiveTabIcon: "#0E2F5A",
              error: "#F44235",
              inProgress: "#4f46e5",
              complete: "#20B832",
              sourceBg: "#E4EBF1"
            }
          }
        },
        (error, result) => {
          if (error) {
            onUploadError?.(error);
            return;
          }

          if (result.event === 'success') {
            onUploadSuccess?.(result.info);
          }
        }
      );
    }
  }, [uwConfig, onUploadSuccess, onUploadError]);

  const openWidget = () => {
    if (widgetRef.current) {
      widgetRef.current.open();
    }
  };
  return (
    <>
      <Script
        src="https://upload-widget.cloudinary.com/global/all.js"
        onLoad={() => setScriptLoaded(true)}
        onError={() => setScriptError(true)}
        strategy="lazyOnload"
      />
      {scriptError ? (
        <div style={{ color: 'red', marginBottom: '1rem' }}>
          Failed to load upload widget. Please disable ad blockers and try again.
        </div>
      ) : (
        <button 
          type="button" 
          className="upload-widget-button"
          onClick={openWidget}
          disabled={!scriptLoaded}
        >
          {scriptLoaded ? 'Upload Photos' : 'Loading...'}
        </button>
      )}
    </>
  );
};

export default CloudinaryUploadWidget;
