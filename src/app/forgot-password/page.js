'use client'
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { passwordReset } from '@/utils/api';
import styles from './page.module.css';

// Icons
const Icons = {
  Eye: ({ show }) => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      {show ? (
        <>
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
          <line x1="1" y1="1" x2="23" y2="23"/>
        </>
      ) : (
        <>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
          <circle cx="12" cy="12" r="3"/>
        </>
      )}
    </svg>
  ),
  
  Lock: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <circle cx="12" cy="16" r="1"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  ),

  Error: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
    </svg>
  ),

  Success: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
    </svg>
  )
};

// Loading component
function LoadingSpinner() {
  return (
    <div className={styles.loadingSpinner}></div>
  );
}

// Content component that uses useSearchParams
function ForgotPasswordContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!password || !confirmPassword) {
      setError('Please fill in both fields.');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    
    setLoading(true);
    const response = await passwordReset(token, password);
    
    if (response.status === 200) {
      setSuccess('Password reset successful! You can now sign in.');
      setPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        window.location.href = '/SignIn';
      }, 1500);
    } else if (response.data && response.data.detail) {
      setError(response.data.detail);
    } else {
      setError('Failed to reset password.');
    }
    
    setLoading(false);
  };

  return (
    <div className={styles.passwordResetContainer}>
      <div className={styles.backgroundElement1}></div>
      <div className={styles.backgroundElement2}></div>

      <div className={styles.passwordResetCard}>
        <div className={styles.gradientBorder}></div>

        <div className={styles.header}>
          <div className={styles.iconContainer}>
            <Icons.Lock />
          </div>
          <h2 className={styles.title}>Reset Password</h2>
          <p className={styles.subtitle}>Enter your new password below</p>
        </div>

        {error && (
          <div className={styles.errorMessage}>
            <Icons.Error />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className={styles.successMessage}>
            <Icons.Success />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className={styles.inputGroup}>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New Password"
              className={styles.input}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={styles.showPasswordButton}
            >
              <Icons.Eye show={showPassword} />
            </button>
          </div>

          <div className={styles.inputGroup}>
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              className={styles.input}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className={styles.showPasswordButton}
            >
              <Icons.Eye show={showConfirmPassword} />
            </button>
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
}

// Main component with Suspense boundary
export default function ForgotPassword() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ForgotPasswordContent />
    </Suspense>
  );
}