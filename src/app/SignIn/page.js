'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import Image from 'next/image';
import styles from './page.module.css';
import axios from 'axios';

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
      const response = await fetch('https://voltvillage-api.onrender.com/api/v1/users/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store token in localStorage
      localStorage.setItem('token', data.token);
      
      // Update auth context
      login(data.token, data.user);
      
      // Redirect to home page after successful login
      router.push('/');
    } catch (err) {
      setError(err.message || 'An error occurred during login');
      console.error('Login error:', err);
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
