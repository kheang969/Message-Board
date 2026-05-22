import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'http://localhost:3001';

function App() {
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await fetch(`${API_URL}/messages`);
      const data = await response.json();
      setMessages(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setLoading(false);
    }
  };
    const deleteMessage = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    
    try {
      const response = await fetch(`${API_URL}/messages/${id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        fetchMessages();
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const response = await fetch(`${API_URL}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username, text: newMessage }),
      });
      
      if (response.ok) {
        setNewMessage('');
        fetchMessages();
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="App">
      <h1>💬 Message Board</h1>
      
      <form onSubmit={handleSubmit} className="message-form">
  <input
    type="text"
    value={username}
    onChange={(e) => setUsername(e.target.value)}
    placeholder="Your name..."
    className="username-input"
  />
  <input
    type="text"
    value={newMessage}
    onChange={(e) => setNewMessage(e.target.value)}
    placeholder="Type a message..."
    className="message-input"
  />
  <button type="submit" className="send-button">Send</button>
</form>

      {loading ? (
        <p>Loading messages...</p>
      ) : (
        <div className="messages-list">
          {messages.length === 0 ? (
            <p>No messages yet. Be the first!</p>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className="message-card">
  <div className="message-header">
   <div className="message-user">{msg.username || 'Anonymous'}</div>
<p className="message-text">{msg.text}</p>
    <button 
      className="delete-button"
      onClick={() => deleteMessage(msg.id)}
    >
      🗑️
    </button>
  </div>
  <small className="message-time">
    {new Date(msg.created_at).toLocaleString()}
  </small>
</div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default App;