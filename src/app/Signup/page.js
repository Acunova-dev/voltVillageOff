'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';
import axios from 'axios';
import { API_BASE_URL, auth } from '@/utils/api';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function SignUp() {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    surname: '',
    phone_number: '',
    gender: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      console.log("Sending registration data to backend...");
      console.log(JSON.stringify(formData));
      const { data } = await axios.post('https://voltvillage-api.onrender.com/api/v1/users/users', 
        formData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      router.push('/SignIn');
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred');
      console.error(`create user error `, err.response?.data?.detail);
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
                        src="/logo official.png"
                        alt="voltVillage Logo"
                        width={250}
                        height={60}
                        priority
                      />
        </div>
        <h1>Welcome to</h1>
        <h2>voltVillage</h2>
        <p className={styles.subtitle}>Your trusted marketplace for university engineering components.</p>
      </div>
      <div className={styles.rightPanel}>
        <div className={styles.formContainer}>
          <h2>Create your account</h2>
          {error && <p className={styles.error}>{error}</p>}
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="name">First Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your first name"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="surname">Surname</label>
              <input
                type="text"
                id="surname"
                name="surname"
                value={formData.surname}
                onChange={handleChange}
                placeholder="Enter your surname"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="phone_number">Phone Number</label>
              <input
                type="tel"
                id="phone_number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                placeholder="Enter your phone number"
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="gender">Gender</label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </div>
            <div className={styles.terms}>
              <input type="checkbox" id="terms" required />
              <label htmlFor="terms">
                By Signing Up, I agree to <Link href="/terms">Terms & Conditions</Link>
              </label>
            </div>
            <div className={styles.actions}>
              <button type="submit" className={styles.signUpBtn} disabled={isLoading}>
                {isLoading ? 'Creating Account...' : 'Sign Up'}
              </button>
              <button 
                type="button" 
                className={styles.signInBtn} 
                onClick={() => router.push('/SignIn')}
                disabled={isLoading}
              >
                Already have an account? Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
