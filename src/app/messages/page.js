"use client"
import { useEffect, useState, useRef } from 'react';
import styles from './page.module.css';
import { FaSearch, FaCircle } from 'react-icons/fa';
import { IoMdSend } from 'react-icons/io';
import NavigationDrawer from '@/components/NavigationDrawer';
import { useSearchParams } from 'next/navigation'
import { getConversations, getMessages } from '@/utils/api';
import { useAuth } from '../context/AuthContext';
import { format, isToday, isYesterday, isThisWeek, parseISO } from 'date-fns';

export default function Messages() {
  const searchParams = useSearchParams();
  const sellerId = searchParams.get('seller');
  const userParam = searchParams.get('user');
  const { user } = useAuth();
  console.log('Current user:', user);
  let userInfo = null;
  if (userParam) {
    try {
      userInfo = JSON.parse(decodeURIComponent(userParam));
      console.log('Parsed user info:', userInfo.name, userInfo.surname);
    } catch (e) {
      userInfo = null;
    }
  }

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const wsRef = useRef(null);
  const [unreadCounts, setUnreadCounts] = useState({});

  // Helper to get the display name for a conversation or selected user
  function getDisplayName(conv) {
    if (!conv) return 'Seller';
    if (conv.displayUser && (conv.displayUser.name || conv.displayUser.surname)) {
      return `${conv.displayUser.name || ''} ${conv.displayUser.surname || ''}`.trim() || conv.displayUser.email || 'Seller';
    }
    if (conv.userInfo && (conv.userInfo.name || conv.userInfo.surname)) {
      return `${conv.userInfo.name || ''} ${conv.userInfo.surname || ''}`.trim() || conv.userInfo.email || 'Seller';
    }
    if (conv.name) return conv.name;
    return 'Seller';
  }

  // Helper to get avatar color based on name
  function getAvatarColor(name) {
    const colors = [
      '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', 
      '#FECA57', '#FF9FF3', '#54A0FF', '#5F27CD'
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  }

  // Check if mobile and handle resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setShowChat(false); // Reset mobile state on desktop
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const data = await getConversations();
        setConversations(data);
        setLoading(false);
        if (sellerId) {
          // Find conversation with sellerId (as user1_id or user2_id)
          const found = data.find(
            (conv) => conv.user1_id == sellerId || conv.user2_id == sellerId
          );
          if (found) {
            // Determine the seller user object from the conversation
            let sellerUser = null;
            if (found.user1_id == sellerId && found.user1) {
              sellerUser = found.user1;
            } else if (found.user2_id == sellerId && found.user2) {
              sellerUser = found.user2;
            }
            setSelectedConversation({
              ...found,
              displayUser: sellerUser || null
            });
            // If mobile and we have a selected conversation from URL, show chat
            if (window.innerWidth <= 768) {
              setShowChat(true);
            }
          } else if (userInfo) {
            // If not found, use the userInfo from the query param
            setSelectedConversation({
              id: null,
              user1_id: user?.id || null,
              user2_id: sellerId,
              lastMessage: '',
              unread: false,
              status: 'Active',
              isNew: true,
              userInfo
            });
            // If mobile and we have userInfo from URL, show chat
            if (window.innerWidth <= 768) {
              setShowChat(true);
            }
          }
        }
      } catch (e) {
        setLoading(false);
      }
    };
    fetchConversations();
  }, [sellerId, userParam, user]);

  // Fetch messages when a conversation is selected
  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedConversation && selectedConversation.id) {
        try {
          const msgs = await getMessages(selectedConversation.id);
          setMessages(msgs);
        } catch (e) {
          setMessages([]);
        }
      } else {
        setMessages([]);
      }
    };
    fetchMessages();
  }, [selectedConversation]);

  const filteredConversations = conversations.filter(conv =>
    (conv.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (conv.lastMessage?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  // Handle conversation selection
  const handleConversationSelect = (conv) => {
    const conversationData = {
      ...conv,
      displayUser: conv.user1_id == user?.id ? conv.user2 : conv.user1
    };
    setSelectedConversation(conversationData);
    
    // On mobile, show the chat when a conversation is selected
    if (isMobile) {
      setShowChat(true);
    }
  };

  // Handle back to conversations
  const handleBackToConversations = () => {
    setShowChat(false);
  };

  // Handle send message
  const handleSendMessage = () => {
    if (newMessage.trim() && selectedConversation && wsRef.current) {
      const messageData = {
        message: newMessage,
        conversation_id: selectedConversation.id,
        sender_id: user?.id,
        receiver_id: selectedConversation.displayUser?.id || selectedConversation.user2_id,
      };
      wsRef.current.send(JSON.stringify(messageData));
      setMessages((prev) => [
        ...prev,
        {
          ...messageData,
          created_at: new Date().toISOString(),
          id: Math.random(), // temporary id for UI
        }
      ]);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Helper to format date dividers
  function getDateDivider(dateString) {
    const date = parseISO(dateString);
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    if (isThisWeek(date, { weekStartsOn: 1 })) return format(date, 'EEEE');
    return format(date, 'dd MMM yyyy');
  }

  // Helper to format time only
  function getTime(dateString) {
    const date = parseISO(dateString);
    return format(date, 'HH:mm');
  }

  // WebSocket setup for real-time chat updates
  useEffect(() => {
    if (!user?.id) return;
    const ws = new WebSocket(`ws://127.0.0.1:8000/api/v1/chat/ws/${user.id}`);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        // Assume data has: { conversation_id, message, sender_id, ... }
        setConversations((prev) => {
          // Move updated conversation to top and update last message
          let updated = prev.map((conv) => {
            if (conv.id === data.conversation_id) {
              // Update unread count
              setUnreadCounts((counts) => ({
                ...counts,
                [conv.id]: (counts[conv.id] || 0) + 1
              }));
              return {
                ...conv,
                messages: conv.messages ? [...conv.messages, data] : [data],
                lastMessage: data.content,
                unread: true
              };
            }
            return conv;
          });
          // If conversation not found, add it
          if (!updated.some((c) => c.id === data.conversation_id)) {
            updated = [
              {
                id: data.conversation_id,
                messages: [data],
                lastMessage: data.content,
                unread: true,
                user1_id: data.sender_id,
                user2_id: user.id,
              },
              ...updated
            ];
          }
          return updated;
        });
      } catch (e) {
        // Ignore parse errors
      }
    };
    ws.onclose = () => {};
    ws.onerror = () => {};
    return () => ws.close();
  }, [user?.id]);

  if (loading) {
    return (
      <div className={styles.container}>
        <NavigationDrawer />
        <main className={styles.main}>
          <div className={styles.loadingContainer}>
            <div className={styles.loadingSpinner}></div>
            <p>Loading conversations...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <NavigationDrawer />
      <main className={styles.main}>
        <div className={styles.messagesContainer}>
          <div className={`${styles.conversationsList} ${isMobile && showChat ? styles.mobileHidden : ''}`}>
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
              {filteredConversations.length === 0 ? (
                <div className={styles.emptyState}>
                  <p>No conversations found</p>
                </div>
              ) : (
                filteredConversations.map((conv) => {
                  const displayUser = conv.user1_id == user?.id ? conv.user2 : conv.user1;
                  const displayName = getDisplayName({...conv, displayUser});
                  const isSelected = selectedConversation && 
                    ((selectedConversation.id && selectedConversation.id === conv.id) ||
                     (selectedConversation.user2_id && selectedConversation.user2_id === conv.user2_id));
                  let lastMessageContent = 'No messages yet';
                  if (conv.messages && conv.messages.length > 0) {
                    lastMessageContent = conv.messages[conv.messages.length - 1].content;
                  } else if (conv.lastMessage) {
                    lastMessageContent = conv.lastMessage;
                  }
                  const unreadCount = unreadCounts[conv.id] || 0;
                  return (
                    <div
                      key={conv.id}
                      className={`${styles.conversationItem} ${conv.unread ? styles.unread : ''} ${isSelected ? styles.selected : ''}`}
                      onClick={() => {
                        handleConversationSelect(conv);
                        setUnreadCounts((counts) => ({ ...counts, [conv.id]: 0 }));
                      }}
                    >
                      <div 
                        className={styles.avatar}
                        style={{ backgroundColor: getAvatarColor(displayName) }}
                      >
                        {displayName.charAt(0).toUpperCase()}
                      </div>
                      <div className={styles.conversationContent}>
                        <div className={styles.conversationHeader}>
                          <h3 className={styles.conversationName}>{displayName}</h3>
                          <span className={styles.timestamp}>{conv.timestamp}</span>
                          {unreadCount > 0 && (
                            <span className={styles.unreadBadge}>{unreadCount}</span>
                          )}
                        </div>
                        <div className={styles.lastMessageRow}>
                          <p className={styles.lastMessage}>
                            {lastMessageContent}
                          </p>
                          {conv.unread && <FaCircle className={styles.unreadDot} />}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
          
          <div className={`${styles.chatArea} ${isMobile && showChat ? styles.mobileActive : ''}`}>
            {selectedConversation ? (
              <div className={styles.chatContent}>
                <div className={styles.chatHeader}>
                  {isMobile && (
                    <button className={styles.backButton} onClick={handleBackToConversations}>
                      ←
                    </button>
                  )}
                  <div 
                    className={styles.avatar}
                    style={{ backgroundColor: getAvatarColor(getDisplayName(selectedConversation)) }}
                  >
                    {getDisplayName(selectedConversation).charAt(0).toUpperCase()}
                  </div>
                  <div className={styles.chatHeaderInfo}>
                    <h3>{getDisplayName(selectedConversation)}</h3>
                    <span className={styles.status}>
                      <span className={`${styles.statusDot} ${styles[(selectedConversation.status?.toLowerCase() || 'active')]}`} />
                      {selectedConversation.status || 'Active'}
                    </span>
                  </div>
                </div>
                
                <div className={styles.messagesList}>
                  {messages.length > 0 ? (() => {
                    let lastDate = null;
                    return messages.map((msg, idx) => {
                      const msgDate = msg.created_at.split('T')[0];
                      const showDivider = !lastDate || lastDate !== msgDate;
                      lastDate = msgDate;
                      return (
                        <>
                          {showDivider && (
                            <div className={styles.dateDivider} key={`divider-${msgDate}`}>{getDateDivider(msg.created_at)}</div>
                          )}
                          <div key={msg.id} className={
                            msg.sender_id === user?.id
                              ? styles.messageItemSent
                              : styles.messageItemReceived
                          }>
                            <div className={styles.messageContent}>{msg.content}</div>
                            <div className={styles.messageMeta}>
                              <span className={styles.messageTime}>{getTime(msg.created_at)}</span>
                            </div>
                          </div>
                        </>
                      );
                    });
                  })() : (
                    <div className={styles.messagesPlaceholder}>
                      <p>Start your conversation with {getDisplayName(selectedConversation)}</p>
                    </div>
                  )}
                </div>
                
                <div className={styles.messageInput}>
                  <input
                    type="text"
                    placeholder="Type a message..."
                    className={styles.textInput}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                  />
                  <button 
                    className={styles.sendButton}
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                  >
                    <IoMdSend />
                  </button>
                </div>
              </div>
            ) : (
              <div className={styles.chatPlaceholder}>
                <div className={styles.placeholderContent}>
                  <div className={styles.placeholderIcon}>💬</div>
                  <h3>Select a conversation to start messaging</h3>
                  <p>Choose from your existing conversations or start a new one</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}