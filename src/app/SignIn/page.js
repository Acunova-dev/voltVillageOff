'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // For now, skip the actual authentication and use the provided token
      login('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3NDU5MTg5MzMsInN1YiI6IjMifQ.oOf0V31zLuaq2VYarh3rCqoYw7QJ3VTA6hU2dzPofd0', {
        email,
        // Add any other user data you want to store
      });
      
      // Redirect to home page after successful login
      router.push('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.container}>
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
