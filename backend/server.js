const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 3001;

// Allow frontend to talk to backend
app.use(cors());
app.use(express.json());

// Create/connect to SQLite database
const db = new sqlite3.Database('./messages.db');

// Create table with username column
db.run(`CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT DEFAULT 'Anonymous',
    text TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

// GET all messages
app.get('/messages', (req, res) => {
    db.all('SELECT * FROM messages ORDER BY created_at DESC', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// POST a new message
app.post('/messages', (req, res) => {
    const { text } = req.body;
    const username = req.body.username || 'Anonymous';
    
    if (!text || text.trim() === '') {
        return res.status(400).json({ error: 'Message cannot be empty' });
    }
    
    db.run('INSERT INTO messages (username, text) VALUES (?, ?)', [username, text], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ 
            id: this.lastID, 
            username: username, 
            text: text, 
            created_at: new Date().toISOString() 
        });
    });
});

// DELETE a message
app.delete('/messages/:id', (req, res) => {
    const id = req.params.id;
    
    db.run('DELETE FROM messages WHERE id = ?', [id], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ error: 'Message not found' });
            return;
        }
        res.json({ message: 'Deleted successfully', id: id });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
});