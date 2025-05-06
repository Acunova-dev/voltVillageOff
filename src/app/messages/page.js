"use client"
import { useState } from 'react';
import styles from './page.module.css';
import { FaSearch, FaCircle } from 'react-icons/fa';
import { IoMdSend } from 'react-icons/io';
import NavigationDrawer from '@/components/NavigationDrawer';

const mockConversations = [
  {
    id: 1,
    name: 'John Doe',
    lastMessage: 'Hey, I&apos;m interested in your solar panel listing',
    timestamp: '2h ago',
    unread: true,
    status: 'Active'
  },
  {
    id: 2,
    name: 'Jane Smith',
    lastMessage: 'Thanks for the quick response!',
    timestamp: '1d ago',
    unread: false,
    status: 'Active'
  },
  // Add more mock conversations as needed
];

export default function Messages() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConversation, setSelectedConversation] = useState(null);

  const filteredConversations = mockConversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={styles.container}>
      <NavigationDrawer />
      <main className={styles.main}>
        <div className={styles.messagesContainer}>
          <div className={styles.conversationsList}>
            <div className={styles.conversationsHeader}>
              <h2>Messages</h2>
              <div className={styles.searchWrapper}>
                <FaSearch className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  className={styles.searchInput}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className={styles.conversations}>
              {filteredConversations.map((conv) => (
                <div
                  key={conv.id}
                  className={`${styles.conversationItem} ${conv.unread ? styles.unread : ''}`}
                  onClick={() => setSelectedConversation(conv)}
                >
                  <div className={styles.avatar}>
                    {conv.name.charAt(0)}
                  </div>
                  <div className={styles.conversationContent}>
                    <div className={styles.conversationHeader}>
                      <h3>{conv.name}</h3>
                      <span className={styles.timestamp}>{conv.timestamp}</span>
                    </div>
                    <p className={styles.lastMessage}>
                      {conv.lastMessage}
                      {conv.unread && <FaCircle className={styles.unreadDot} />}
                    </p>
                    <span className={styles.status}>
                      <span className={`${styles.statusDot} ${styles[conv.status.toLowerCase()]}`} />
                      {conv.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.chatArea}>
            {selectedConversation ? (
              <div className={styles.chatContent}>
                <div className={styles.chatHeader}>
                  <div className={styles.avatar}>
                    {selectedConversation.name.charAt(0)}
                  </div>
                  <div className={styles.chatHeaderInfo}>
                    <h3>{selectedConversation.name}</h3>
                    <span className={styles.status}>
                      <span className={`${styles.statusDot} ${styles[selectedConversation.status.toLowerCase()]}`} />
                      {selectedConversation.status}
                    </span>
                  </div>
                </div>
                <div className={styles.messagesList}>
                  {/* Messages will be rendered here */}
                </div>
                <div className={styles.messageInput}>
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className={styles.textInput}
                  />
                  <button className={styles.sendButton}>
                    <IoMdSend />
                  </button>
                </div>
              </div>
            ) : (
              <p className={styles.chatPlaceholder}>Select a conversation to start messaging</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
} 