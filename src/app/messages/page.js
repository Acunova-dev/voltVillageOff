import React from 'react';
import styles from './page.module.css';
import NavigationDrawer from '../../components/NavigationDrawer';

export default function Messages() {
  // Mock data for conversations
  const conversations = [
    {
      id: 1,
      user: {
        name: 'Alice Smith',
        avatar: '/placeholder-avatar.jpg',
        lastSeen: 'Online'
      },
      lastMessage: {
        text: 'Is the Arduino Uno still available?',
        timestamp: '2 mins ago',
        unread: true
      }
    },
    {
      id: 2,
      user: {
        name: 'Bob Johnson',
        avatar: '/placeholder-avatar.jpg',
        lastSeen: '1 hour ago'
      },
      lastMessage: {
        text: 'Thanks for the oscilloscope, works perfectly!',
        timestamp: '1 day ago',
        unread: false
      }
    }
  ];

  return (
    <div className={styles.container}>
      <NavigationDrawer />
      
      <main className={styles.main}>
        <div className={styles.messagesContainer}>
          <div className={styles.conversationsList}>
            <div className={styles.conversationsHeader}>
              <h2>Messages</h2>
              <input 
                type="text" 
                placeholder="Search conversations..."
                className={styles.searchInput}
              />
            </div>

            <div className={styles.conversations}>
              {conversations.map((conversation) => (
                <div 
                  key={conversation.id} 
                  className={`${styles.conversationItem} ${conversation.lastMessage.unread ? styles.unread : ''}`}
                >
                  <div className={styles.avatar}>
                    {conversation.user.name.charAt(0)}
                  </div>
                  
                  <div className={styles.conversationContent}>
                    <div className={styles.conversationHeader}>
                      <h3>{conversation.user.name}</h3>
                      <span className={styles.timestamp}>
                        {conversation.lastMessage.timestamp}
                      </span>
                    </div>
                    
                    <p className={styles.lastMessage}>
                      {conversation.lastMessage.text}
                    </p>
                    
                    <span className={styles.status}>
                      {conversation.user.lastSeen}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.chatArea}>
            <div className={styles.chatPlaceholder}>
              <p>Select a conversation to start messaging</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 