/*const expeess = require('express')
const sqlite = require('sqlite3')
const portnum = (4444)
const app = express();
app.get=(portnum,(req,res)=>{
    console.log("server connected successfully")
})*/

//database connection
const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = (3000);

// Connect to SQLite database
const db = new sqlite3.Database('./cricketTeam.db', err => {
  if (err) {
    console.error('Database connection error:', err.message);
  } else {
    
    console.log('Connected to SQLite database');
    // Create cricket_team table if it doesn't exist
    db.run(`CREATE TABLE IF NOT EXISTS cricket_team (
      player_id INTEGER PRIMARY KEY AUTOINCREMENT,
      player_name TEXT,
      jersey_number INTEGER,
      role TEXT
    )`);
  }
});

// Middleware to parse JSON bodies
app.use(express.json());

// API 1: Get all players
app.get('/players/', (req, res) => {
  db.all('SELECT * FROM cricket_team', (err, rows) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Database error' });
      return;
    }
    res.json(rows);
  });
});

// API 2: Add a new player
app.post('/players/', (req, res) => {
  const { playerName, jerseyNumber, role } = req.body;
  db.run(`INSERT INTO cricket_team (player_name, jersey_number, role)
          VALUES (?, ?, ?)`, [playerName, jerseyNumber, role], function(err) {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Failed to add player' });
      return;
    }
    res.send('Player Added to Team');
  });
});

// API 3: Get a player by playerId
app.get('/players/:playerId/', (req, res) => {
  const playerId = req.params.playerId;
  db.get('SELECT * FROM cricket_team WHERE player_id = ?', [playerId], (err, row) => {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Database error' });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Player not found' });
    } else {
      res.json(row);
    }
  });
});

// API 4: Update player details
app.put('/players/:playerId/', (req, res) => {
  const playerId = req.params.playerId;
  const { playerName, jerseyNumber, role } = req.body;
  db.run(`UPDATE cricket_team
          SET player_name = ?, jersey_number = ?, role = ?
          WHERE player_id = ?`, [playerName, jerseyNumber, role, playerId], function(err) {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Failed to update player' });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Player not found' });
    } else {
      res.send('Player Details Updated');
    }
  });
});

// API 5: Delete a player
app.delete('/players/:playerId/', (req, res) => {
  const playerId = req.params.playerId;
  db.run('DELETE FROM cricket_team WHERE player_id = ?', [playerId], function(err) {
    if (err) {
      console.error(err.message);
      res.status(500).json({ error: 'Failed to delete player' });
      return;
    }
    if (this.changes === 0) {
      res.status(404).json({ error: 'Player not found' });
    } else {
      res.send('Player Removed');
    }
  });
});

// Default route for handling unknown paths
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Exporting the app instance
module.exports = app;

