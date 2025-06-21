"use client"
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import NavigationDrawer from '@/components/NavigationDrawer';
import styles from './page.module.css';
import { 
  FaUsers, 
  FaBox, 
  FaComments, 
  FaChartLine, 
  FaUserShield, 
  FaCalendarDay,
  FaCalendarWeek,
  FaCalendarAlt,
  FaArrowUp,
  FaArrowDown,
  FaSpinner,
  FaEye,
  FaEyeSlash,
  FaUserCheck,
  FaUserTimes,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaStar
} from 'react-icons/fa';
import { analytics } from '@/utils/api';

export default function Dashboard() {
  const { user, isLoading, isInitialized } = useAuth();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (isInitialized && !isLoading) {
      if (!user) {
        router.push('/SignIn');
        return;
      }
      
      if (!user.is_superuser) {
        router.push('/');
        return;
      }
      
      fetchDashboardData();
    }
  }, [user, isLoading, isInitialized, router]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await analytics.getDashboard();
      setDashboardData(response.data);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError(err.response?.data?.detail || err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon, trend, trendValue, color, subtitle }) => (
    <div className={styles.statCard}>
      <div className={styles.statHeader}>
        <div className={styles.statIcon} style={{ backgroundColor: color }}>
          {icon}
        </div>
        <div className={styles.statTrend}>
          {trend === 'up' && <FaArrowUp className={styles.trendUp} />}
          {trend === 'down' && <FaArrowDown className={styles.trendDown} />}
          <span className={trend === 'up' ? styles.trendUp : styles.trendDown}>
            {trendValue}
          </span>
        </div>
      </div>
      <div className={styles.statContent}>
        <h3 className={styles.statValue}>{value}</h3>
        <p className={styles.statTitle}>{title}</p>
        {subtitle && <p className={styles.statSubtitle}>{subtitle}</p>}
      </div>
    </div>
  );

  const CategoryCard = ({ category, count, percentage }) => (
    <div className={styles.categoryCard}>
      <div className={styles.categoryInfo}>
        <h4 className={styles.categoryName}>{category}</h4>
        <p className={styles.categoryCount}>{count} items</p>
      </div>
      <div className={styles.categoryBar}>
        <div 
          className={styles.categoryProgress} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <span className={styles.categoryPercentage}>{percentage}%</span>
    </div>
  );

  if (!isInitialized || isLoading) {
    return (
      <div className={styles.container}>
        <NavigationDrawer />
        <main className={styles.main}>
          <div className={styles.loadingContainer}>
            <FaSpinner className={styles.loadingSpinner} />
            <p>Loading dashboard...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!user || !user.is_superuser) {
    return null;
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <NavigationDrawer />
        <main className={styles.main}>
          <div className={styles.loadingContainer}>
            <FaSpinner className={styles.loadingSpinner} />
            <p>Loading dashboard data...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <NavigationDrawer />
        <main className={styles.main}>
          <div className={styles.errorContainer}>
            <h2>Error Loading Dashboard</h2>
            <p>{error}</p>
            <button onClick={fetchDashboardData} className={styles.retryButton}>
              Retry
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  const { users, items, chats } = dashboardData;
  const totalCategories = Object.keys(items.items_by_category).length;
  const categoryPercentages = Object.entries(items.items_by_category).map(([category, count]) => ({
    category,
    count,
    percentage: Math.round((count / items.total_items) * 100)
  }));

  return (
    <div className={styles.container}>
      <NavigationDrawer />
      <main className={styles.main}>
        <div className={styles.header}>
          <h1>Admin Dashboard</h1>
          <p className={styles.lastUpdated}>
            Last updated: {new Date(dashboardData.last_updated).toLocaleString()}
          </p>
        </div>

        <div className={styles.tabs}>
          <button 
            className={`${styles.tab} ${activeTab === 'overview' ? styles.active : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <FaChartLine /> Overview
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'users' ? styles.active : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <FaUsers /> Users
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'items' ? styles.active : ''}`}
            onClick={() => setActiveTab('items')}
          >
            <FaBox /> Items
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'chats' ? styles.active : ''}`}
            onClick={() => setActiveTab('chats')}
          >
            <FaComments /> Chats
          </button>
        </div>

        {activeTab === 'overview' && (
          <div className={styles.overviewSection}>
            <div className={styles.statsGrid}>
              <StatCard
                title="Total Users"
                value={users.total_users}
                icon={<FaUsers />}
                trend="up"
                trendValue={`+${users.new_users_this_month}`}
                color="#3b82f6"
                subtitle={`${users.active_users} active`}
              />
              <StatCard
                title="Total Items"
                value={items.total_items}
                icon={<FaBox />}
                trend="up"
                trendValue={`+${items.new_items_this_month}`}
                color="#10b981"
                subtitle={`${items.active_items} active`}
              />
              <StatCard
                title="Total Conversations"
                value={chats.total_conversations}
                icon={<FaComments />}
                trend="up"
                trendValue={`+${chats.new_conversations_this_month}`}
                color="#f59e0b"
                subtitle={`${chats.active_conversations} active`}
              />
              <StatCard
                title="Superusers"
                value={users.superusers}
                icon={<FaUserShield />}
                trend="neutral"
                trendValue=""
                color="#8b5cf6"
                subtitle="Administrators"
              />
            </div>

            <div className={styles.chartsSection}>
              <div className={styles.chartCard}>
                <h3>Recent Activity</h3>
                <div className={styles.activityGrid}>
                  <div className={styles.activityItem}>
                    <FaCalendarDay className={styles.activityIcon} />
                    <div className={styles.activityContent}>
                      <h4>Today</h4>
                      <p>{users.new_users_today} new users, {items.new_items_today} new items</p>
                    </div>
                  </div>
                  <div className={styles.activityItem}>
                    <FaCalendarWeek className={styles.activityIcon} />
                    <div className={styles.activityContent}>
                      <h4>This Week</h4>
                      <p>{users.new_users_this_week} new users, {items.new_items_this_week} new items</p>
                    </div>
                  </div>
                  <div className={styles.activityItem}>
                    <FaCalendarAlt className={styles.activityIcon} />
                    <div className={styles.activityContent}>
                      <h4>This Month</h4>
                      <p>{users.new_users_this_month} new users, {items.new_items_this_month} new items</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.chartCard}>
                <h3>Items by Category</h3>
                <div className={styles.categoriesList}>
                  {categoryPercentages.map(({ category, count, percentage }) => (
                    <CategoryCard
                      key={category}
                      category={category}
                      count={count}
                      percentage={percentage}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className={styles.detailSection}>
            <div className={styles.statsGrid}>
              <StatCard
                title="Total Users"
                value={users.total_users}
                icon={<FaUsers />}
                color="#3b82f6"
              />
              <StatCard
                title="Active Users"
                value={users.active_users}
                icon={<FaUsers />}
                color="#10b981"
              />
              <StatCard
                title="Superusers"
                value={users.superusers}
                icon={<FaUserShield />}
                color="#8b5cf6"
              />
            </div>
            <div className={styles.timelineGrid}>
              <div className={styles.timelineCard}>
                <h3>User Growth</h3>
                <div className={styles.timelineItem}>
                  <FaCalendarDay />
                  <span>Today: {users.new_users_today} new users</span>
                </div>
                <div className={styles.timelineItem}>
                  <FaCalendarWeek />
                  <span>This Week: {users.new_users_this_week} new users</span>
                </div>
                <div className={styles.timelineItem}>
                  <FaCalendarAlt />
                  <span>This Month: {users.new_users_this_month} new users</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'items' && (
          <div className={styles.detailSection}>
            <div className={styles.statsGrid}>
              <StatCard
                title="Total Items"
                value={items.total_items}
                icon={<FaBox />}
                color="#10b981"
              />
              <StatCard
                title="Active Items"
                value={items.active_items}
                icon={<FaBox />}
                color="#3b82f6"
              />
              <StatCard
                title="Categories"
                value={totalCategories}
                icon={<FaBox />}
                color="#f59e0b"
              />
            </div>
            <div className={styles.chartCard}>
              <h3>Items by Category</h3>
              <div className={styles.categoriesList}>
                {categoryPercentages.map(({ category, count, percentage }) => (
                  <CategoryCard
                    key={category}
                    category={category}
                    count={count}
                    percentage={percentage}
                  />
                ))}
              </div>
            </div>
            <div className={styles.timelineGrid}>
              <div className={styles.timelineCard}>
                <h3>Item Growth</h3>
                <div className={styles.timelineItem}>
                  <FaCalendarDay />
                  <span>Today: {items.new_items_today} new items</span>
                </div>
                <div className={styles.timelineItem}>
                  <FaCalendarWeek />
                  <span>This Week: {items.new_items_this_week} new items</span>
                </div>
                <div className={styles.timelineItem}>
                  <FaCalendarAlt />
                  <span>This Month: {items.new_items_this_month} new items</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'chats' && (
          <div className={styles.detailSection}>
            <div className={styles.statsGrid}>
              <StatCard
                title="Total Conversations"
                value={chats.total_conversations}
                icon={<FaComments />}
                color="#f59e0b"
              />
              <StatCard
                title="Active Conversations"
                value={chats.active_conversations}
                icon={<FaComments />}
                color="#10b981"
              />
              <StatCard
                title="Total Messages"
                value={chats.total_messages}
                icon={<FaComments />}
                color="#3b82f6"
              />
              <StatCard
                title="Avg Messages/Conversation"
                value={chats.average_messages_per_conversation}
                icon={<FaComments />}
                color="#8b5cf6"
              />
            </div>
            <div className={styles.timelineGrid}>
              <div className={styles.timelineCard}>
                <h3>Conversation Growth</h3>
                <div className={styles.timelineItem}>
                  <FaCalendarDay />
                  <span>Today: {chats.new_conversations_today} new conversations</span>
                </div>
                <div className={styles.timelineItem}>
                  <FaCalendarWeek />
                  <span>This Week: {chats.new_conversations_this_week} new conversations</span>
                </div>
                <div className={styles.timelineItem}>
                  <FaCalendarAlt />
                  <span>This Month: {chats.new_conversations_this_month} new conversations</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 