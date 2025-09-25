import React, { createContext, useContext, useState, useCallback } from 'react';
import { Snackbar, Alert } from '@mui/material';

const MessageContext = createContext();

export const useMessage = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessage must be used within a MessageProvider');
  }
  return context;
};

export const MessageProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);

  const showMessage = useCallback((message, type = 'info', duration = 6000) => {
    const id = Date.now() + Math.random();
    const newMessage = {
      id,
      message,
      type,
      duration,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, newMessage]);

    // Auto remove message after duration
    setTimeout(() => {
      setMessages(prev => prev.filter(msg => msg.id !== id));
    }, duration);

    return id;
  }, []);

  const showSuccess = useCallback((message, duration) => {
    return showMessage(message, 'success', duration);
  }, [showMessage]);

  const showError = useCallback((message, duration) => {
    return showMessage(message, 'error', duration);
  }, [showMessage]);

  const showWarning = useCallback((message, duration) => {
    return showMessage(message, 'warning', duration);
  }, [showMessage]);

  const showInfo = useCallback((message, duration) => {
    return showMessage(message, 'info', duration);
  }, [showMessage]);

  const removeMessage = useCallback((id) => {
    setMessages(prev => prev.filter(msg => msg.id !== id));
  }, []);

  const clearAllMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const value = {
    messages,
    showMessage,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeMessage,
    clearAllMessages
  };

  return (
    <MessageContext.Provider value={value}>
      {children}
      <MessageContainer messages={messages} onRemove={removeMessage} />
    </MessageContext.Provider>
  );
};

const MessageContainer = ({ messages, onRemove }) => {
  return (
    <div>
      {messages.map((message, index) => (
        <Snackbar
          key={message.id}
          open={true}
          autoHideDuration={message.duration}
          onClose={() => onRemove(message.id)}
          anchorOrigin={{ 
            vertical: 'top', 
            horizontal: 'right' 
          }}
          sx={{
            position: 'fixed',
            top: `${80 + (index * 70)}px`,
            right: '20px',
            zIndex: 9999
          }}
        >
          <Alert
            onClose={() => onRemove(message.id)}
            severity={message.type}
            variant="filled"
            sx={{ 
              width: '100%',
              minWidth: '300px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
            }}
          >
            {message.message}
          </Alert>
        </Snackbar>
      ))}
    </div>
  );
};

