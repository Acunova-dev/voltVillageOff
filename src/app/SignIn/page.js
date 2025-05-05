'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import Image from 'next/image';
import styles from './page.module.css';
import LoadingSpinner from '@/components/LoadingSpinner';
import { auth } from '@/utils/api';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await auth.login({ email, password });
      
      // The API response has the token directly in response.data
      const { data } = response;
      console.log('Login response:', data);

      if (!data) {
        throw new Error('Login failed - invalid response');
      }

      // Now pass the token and user data to the auth context
      await login(data.access_token, data.user);
      router.push('/');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.detail || err.message || 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {isLoading && <LoadingSpinner fullScreen />}
      <div className={styles.leftPanel}>
        <div className={styles.logoContainer}>
          <Image
            src="/vercel.svg"
            alt="Logo"
            width={40}
            height={40}
            className={styles.logo}
          />
          <h2>voltVillage</h2>
        </div>
        <h1>Welcome to</h1>
        <h2>voltVillage</h2>
        <p className={styles.subtitle}>Your trusted marketplace for university engineering components.</p>
      </div>
      <div className={styles.rightPanel}>
        <div className={styles.formContainer}>
          <h2>Sign In</h2>
          {error && <p className={styles.error}>{error}</p>}
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            <div className={styles.actions}>
              <button type="submit" className={styles.signUpBtn}>
                Sign In
              </button>
              <button type="button" className={styles.signInBtn} onClick={() => router.push('/Signup')}>
                Don't have an account? Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
