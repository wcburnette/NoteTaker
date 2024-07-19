// Import required modules
const express = require('express');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

// Create an instance of the Express application
const app = express();

// Define the port for the server to listen on
const PORT = process.env.PORT || 3001;

// Middleware to parse incoming JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Function to read notes from the JSON file
const getNotes = () => {
  // Read and parse the JSON file containing notes
  const data = fs.readFileSync(path.join(__dirname, 'db', 'db.json'), 'utf8');
  return JSON.parse(data);
};

// Function to save notes to the JSON file
const saveNotes = (notes) => {
  // Write the updated notes to the JSON file
  fs.writeFileSync(path.join(__dirname, 'db', 'db.json'), JSON.stringify(notes, null, 2));
};

// API route to get all notes
app.get('/api/notes', (req, res) => {
  // Retrieve notes and send them as a JSON response
  const notes = getNotes();
  res.json(notes);
});

// API route to create a new note
app.post('/api/notes', (req, res) => {
  // Retrieve existing notes
  const notes = getNotes();
  // Create a new note with a unique ID and data from the request body
  const newNote = { id: uuidv4(), ...req.body };
  // Add the new note to the notes array
  notes.push(newNote);
  // Save the updated notes to the file
  saveNotes(notes);
  // Send the new note as a JSON response
  res.json(newNote);
});

// API route to delete a note by ID
app.delete('/api/notes/:id', (req, res) => {
  // Retrieve existing notes
  let notes = getNotes();
  // Filter out the note with the given ID
  notes = notes.filter((note) => note.id !== req.params.id);
  // Save the updated notes to the file
  saveNotes(notes);
  // Send a confirmation message as a JSON response
  res.json({ message: 'Note deleted' });
});

// Route to serve the notes HTML page
app.get('/notes', (req, res) => {
  // Send the notes.html file as the response
  res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

// Catch-all route to serve the index HTML page
app.get('*', (req, res) => {
  // Send the index.html file as the response for all other routes
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});



