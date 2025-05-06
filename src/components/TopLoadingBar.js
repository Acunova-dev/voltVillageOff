'use client';

import { useEffect, useState, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import styles from './TopLoadingBar.module.css';

function TopLoadingBarContent() {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timeout);
  }, [pathname, searchParams]);

  if (!loading) return null;

  return <div className={styles.loadingBar} />;
}

export default function TopLoadingBar() {
  return (
    <Suspense fallback={<div className={styles.loadingBar} />}>
      <TopLoadingBarContent />
    </Suspense>
  );
}