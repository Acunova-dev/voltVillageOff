'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
  const { login, user, isInitialized } = useAuth();

  useEffect(() => {
    // Redirect to home if already authenticated
    if (isInitialized && user) {
      router.push('/');
    }
  }, [user, isInitialized, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await auth.login({ email, password });
      const { data } = response;

      if (!data || !data.access_token) {
        throw new Error('Login failed - invalid response');
      }

      await login(data.access_token, data.user);
      router.push('/');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.detail || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  // Don't render anything while checking initial auth state
  if (!isInitialized) {
    return <LoadingSpinner fullScreen />;
  }

  // Don't render the login form if already authenticated
  if (user) {
    return null;
  }

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
              <p>
                Don&apos;t have an account?{' '}
                <Link href="/Signup" className={styles.link}>
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
