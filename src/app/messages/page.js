"use client"
import { useEffect, useState, useRef, Fragment } from 'react';
import styles from './page.module.css';
import { FaSearch, FaCircle } from 'react-icons/fa';
import { IoMdSend } from 'react-icons/io';
import NavigationDrawer from '@/components/NavigationDrawer';
import { useSearchParams } from 'next/navigation'
import { getConversations, getMessages, sendMessage } from '@/utils/api';
import { useAuth } from '../context/AuthContext';
import { format, isToday, isYesterday, isThisWeek, parseISO } from 'date-fns';
import { useRouter } from 'next/navigation';

export default function Messages() {
  const searchParams = useSearchParams();
  const sellerId = searchParams.get('seller');
  const userParam = searchParams.get('user');
  const defaultMessage = searchParams.get('message') || '';
  const { user, isLoading, isInitialized } = useAuth();
  const router = useRouter();
  
  let userInfo = null;
  // Remove broken JSON.parse for defaultMessage, just use the string
  if (userParam) {
    try {
      userInfo = JSON.parse(decodeURIComponent(userParam));
      console.log('Parsed user info:', userInfo.name, userInfo.surname);
    } catch (e) {
      console.error('Error parsing user info:', e);
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
  const messagesEndRef = useRef(null);
  const selectedConversationRef = useRef(null);

  // Update ref when selectedConversation changes
  useEffect(() => {
    selectedConversationRef.current = selectedConversation;
  }, [selectedConversation]);

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

  // Auth check
  useEffect(() => {
    if (isInitialized && !isLoading && !user) {
      router.push('/SignIn');
      return;
    }
  }, [user, isLoading, isInitialized, router]);
    
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

  // Fetch conversations
  useEffect(() => {
    const fetchConversations = async () => {
      if (!user?.id) return;
      
      try {
        const data = await getConversations();
        setConversations(data);
        setLoading(false);
        
        if (sellerId) {
          // Convert sellerId to number for comparison if needed
          const sellerIdNum = Number(sellerId);
          
          // Find conversation with sellerId (as user1_id or user2_id)
          const found = data.find(
            (conv) => conv.user1_id === sellerIdNum || conv.user2_id === sellerIdNum
          );
          
          if (found) {
            // Determine the seller user object from the conversation
            let sellerUser = null;
            if (found.user1_id === sellerIdNum && found.user1) {
              sellerUser = found.user1;
            } else if (found.user2_id === sellerIdNum && found.user2) {
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
              user2_id: sellerIdNum,
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
        console.error('Error fetching conversations:', e);
        setLoading(false);
      }
    };
    
    fetchConversations();
  }, [sellerId, userParam, user?.id]);

  // Fetch messages when a conversation is selected
  useEffect(() => {
    const fetchMessages = async () => {
      if (selectedConversation && selectedConversation.id) {
        try {
          const msgs = await getMessages(selectedConversation.id);
          setMessages(msgs);
        } catch (e) {
          console.error('Error fetching messages:', e);
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
    console.log("clicked conv", conv);
    
    const conversationData = {
      ...conv,
      displayUser: conv.user1_id === user?.id ? conv.user2 : conv.user1
    };

    setSelectedConversation(conversationData);
    
    // Clear unread count when selecting conversation
    setUnreadCounts(prev => ({ ...prev, [conv.id]: 0 }));
    
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
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const trimmedMessage = newMessage.trim();
    setNewMessage(''); // Clear input immediately for better UX

    // If it's a new conversation (no ID), create it first
    if (!selectedConversation.id) {
      try {
        const messData = {
          content: trimmedMessage,
          receiver_id: selectedConversation.displayUser?.id || selectedConversation.user2_id
        };
        
        const response = await sendMessage(messData);
        console.log('New conversation message sent:', response.data);
        
        // Update the selected conversation with the new conversation ID
        const newConversationId = response.data.conversation_id;
        setSelectedConversation(prev => ({
          ...prev,
          id: newConversationId
        }));
        
        // Add message to current chat
        setMessages(prev => [...prev, response.data]);
        
        return;
      } catch (error) {
        console.error('Error sending message to new conversation:', error);
        setNewMessage(trimmedMessage); // Restore message on error
        return;
      }
    }

    // For existing conversations
    const messageData = {
      message: trimmedMessage,
      conversation_id: selectedConversation.id,
      sender_id: user?.id,
      receiver_id: selectedConversation.displayUser?.id || selectedConversation.user2_id,
    };

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      // Send via WebSocket
      wsRef.current.send(JSON.stringify(messageData));
    } else {
      // Fallback to HTTP API
      console.warn('WebSocket not available, using HTTP fallback');
      try {
        const messData = {
          content: trimmedMessage,
          receiver_id: selectedConversation.displayUser?.id || selectedConversation.user2_id
        };
        
        const response = await sendMessage(messData);
        console.log('Message sent via HTTP:', response.data);
        
        // Add message to current chat immediately
        setMessages(prev => [...prev, response.data]);
        
      } catch (error) {
        console.error('Error sending message:', error);
        setNewMessage(trimmedMessage); // Restore message on error
      }
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

  // WebSocket setup for real-time chat updates with reconnect and exponential backoff
  useEffect(() => {
    if (!user?.id) return;

    let ws;
    let reconnectAttempts = 0;
    let reconnectTimeout = null;
    let isUnmounted = false;

    const connectWebSocket = () => {
      // ws = new WebSocket(`ws://127.0.0.1:8000/api/v1/chat/ws/${user.id}`);
      ws = new WebSocket(`wss://voltvillage-api.onrender.com/api/v1/chat/ws/${user.id}`);

      wsRef.current = ws;

      ws.onopen = () => {
        reconnectAttempts = 0;
        // Optionally log or notify connection success
        console.log('WebSocket connected');
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log("webhook message", data);
          // Update conversations and move the latest to the top
          setConversations((prev) => {
            let updated = prev.map((conv) => {
              if (conv.id === data.conversation_id) {
                return {
                  ...conv,
                  messages: conv.messages ? [...conv.messages, data] : [data],
                  lastMessage: data.message || data.content,
                  unread: data.sender_id !== user.id
                };
              }
              return conv;
            });
            // If conversation doesn't exist, create it
            if (!updated.some((c) => c.id === data.conversation_id)) {
              updated = [
                {
                  id: data.conversation_id,
                  messages: [data],
                  lastMessage: data.message || data.content,
                  unread: data.sender_id !== user.id,
                  user1_id: data.sender_id,
                  user2_id: user.id,
                },
                ...updated
              ];
            }
            // Move the updated/created conversation to the top
            const idx = updated.findIndex(c => c.id === data.conversation_id);
            if (idx > 0) {
              const [convToTop] = updated.splice(idx, 1);
              updated = [convToTop, ...updated];
            }
            return updated;
          });

          // Update unread counts only for messages not from current user
          if (data.sender_id !== user.id) {
            setUnreadCounts((counts) => ({
              ...counts,
              [data.conversation_id]: (counts[data.conversation_id] || 0) + 1
            }));
          }

          // Check if message is for currently open conversation using ref
          const currentConversation = selectedConversationRef.current;
          if (currentConversation && data.conversation_id === currentConversation.id) {
            setMessages((prevMessages) => {
              // Prevent duplicate messages
              if (prevMessages.some(m => 
                (m.id && data.id && m.id === data.id) || 
                (m.created_at === data.created_at && m.sender_id === data.sender_id)
              )) {
                return prevMessages;
              }
              return [...prevMessages, data];
            });
          }
          
        } catch (e) {
          console.error('WebSocket message parse error:', e);
        }
      };

      ws.onclose = () => {
        if (isUnmounted) return;
        reconnectAttempts++;
        const delay = Math.min(1000 * 2 ** reconnectAttempts, 30000); // max 30s
        console.log(`WebSocket closed. Reconnecting in ${delay / 1000}s...`);
        reconnectTimeout = setTimeout(connectWebSocket, delay);
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        ws.close(); // Ensure onclose is called
      };
    };

    connectWebSocket();

    return () => {
      isUnmounted = true;
      if (ws) ws.close();
      if (reconnectTimeout) clearTimeout(reconnectTimeout);
    };
  }, [user?.id]); // Removed selectedConversation from dependencies, using ref instead

  // Auto-scroll to bottom of messages when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Populate interest message in input if present and this is a new conversation
  useEffect(() => {
    if (sellerId && defaultMessage && selectedConversation && !selectedConversation.id) {
      setNewMessage(defaultMessage);
    }
  }, [sellerId, defaultMessage, selectedConversation]);

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
                  const displayUser = conv.user1_id === user?.id ? conv.user2 : conv.user1;
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
                    {/* <span className={styles.status}>
                      <span className={`${styles.statusDot} ${styles[(selectedConversation.status?.toLowerCase() || 'active')]}`} />
                      {selectedConversation.status || 'Active'}
                    </span> */}
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
                        <Fragment key={`msg-group-${msg.id || idx}`}>
                          {showDivider && (
                            <div className={styles.dateDivider} key={`divider-${msgDate}`}>
                              {getDateDivider(msg.created_at)}
                            </div>
                          )}
                          <div 
                            key={`message-${msg.id || idx}`} 
                            className={
                              msg.sender_id === user?.id
                                ? styles.messageItemSent
                                : styles.messageItemReceived
                            }
                          >
                            <div className={styles.messageContent}>
                              {msg.message || msg.content}
                            </div>
                            <div className={styles.messageMeta}>
                              <span className={styles.messageTime}>
                                {getTime(msg.created_at)}
                              </span>
                            </div>
                          </div>
                        </Fragment>
                      );
                    });
                  })() : (
                    <div className={styles.messagesPlaceholder}>
                      <p>Start your conversation with {getDisplayName(selectedConversation)}</p>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
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