'use client';

import { useState } from 'react';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { auth } from '@/utils/api';
import Image from 'next/image';
import Link from 'next/link';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function SignIn() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  console.log('login function:', login);  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      // First, authenticate with the API
      const response = await auth.login({ email, password });
      console.log('API login response:', response);

      if (!response?.data?.access_token) {
        throw new Error('Invalid response from server');
      }

      // Then use the token to initialize the auth context
      await login(response.data.access_token, response.data.user);
      
      router.push('/');
    } catch (err) {
      console.error('SignIn error:', err);
      setError(err.response?.data?.detail || err.message || 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError('');
    setResetSuccess(false);
    setIsLoading(true);
    
    try {
      await auth.forgotPassword({ email: forgotPasswordEmail });
      setResetSuccess(true);
      setShowForgotPassword(false);
      setForgotPasswordEmail('');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to process password reset request');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {isLoading && <LoadingSpinner fullScreen />}
      <div className={styles.leftPanel}>
        <div className={styles.logoContainer}>          <Image
            src="/vercel.svg"
            alt="Logo"
            width={40}
            height={40}
            style={{ height: '40px' }}
            className={styles.logo}
          />
          <h2>voltVillage</h2>
        </div>
        <h1>Welcome back to</h1>
        <h2>voltVillage</h2>
        <p className={styles.subtitle}>Your trusted marketplace for university engineering components.</p>
      </div>
      <div className={styles.rightPanel}>
        <div className={styles.formContainer}>
          <h2>{showForgotPassword ? 'Reset Password' : 'Sign In to your account'}</h2>
          {resetSuccess && (
            <div className={styles.success}>
              If a matching account was found, a password reset email has been sent.
            </div>
          )}
          {error && <div className={styles.error}>{error}</div>}
          
          {!showForgotPassword ? (
            <>
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formGroup}>
                  <label htmlFor="email">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    id="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className={styles.signUpBtn} disabled={isLoading}>
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </button>
              </form>
              <button 
                onClick={() => setShowForgotPassword(true)}
                className={styles.forgotPassword}
              >
                Forgot Password?
              </button>
              <div className={styles.actions}>
                <button 
                  type="button" 
                  className={styles.signInBtn}
                  onClick={() => router.push('/Signup')}
                >
                  Don't have an account? Sign Up
                </button>
              </div>
            </>
          ) : (
            <>
              <form onSubmit={handleForgotPassword} className={styles.form}>
                <div className={styles.formGroup}>
                  <label htmlFor="forgotPasswordEmail">Email Address</label>
                  <input
                    type="email"
                    id="forgotPasswordEmail"
                    placeholder="Enter your email"
                    value={forgotPasswordEmail}
                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className={styles.signUpBtn} disabled={isLoading}>
                  {isLoading ? 'Sending...' : 'Reset Password'}
                </button>
              </form>
              <button
                type="button"
                onClick={() => setShowForgotPassword(false)}
                className={styles.forgotPassword}
              >
                Back to Sign In
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
