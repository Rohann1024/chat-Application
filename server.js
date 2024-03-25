const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const PORT = process.env.PORT || 5000;
const app = express();
dotenv.config();
const password = process.env.DB_PASSWORD;

app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
app.use(cors({
    origin: 'http://localhost:3000', // Allow requests from this origin
}));

const DB = `mongodb+srv://rs1220525:${password}@cluster0.jkmlqfw.mongodb.net/?retryWrites=true&w=majority`;

mongoose.connect(DB, { useNewUrlParser: true, useUnifiedTopology: true }) // Add options object for avoiding deprecation warnings
    .then(() => {
        console.log('Successful Connection...');
    })
    .catch((err) => console.log(err));

// Creating Schema
const chatShema = new mongoose.Schema({
    admin: { type: String, required: true },
    roomName: { type: String, required: true },
    roomCode: { type: String, required: true },
});

const chatRoom = mongoose.model('chatRoom', chatShema);

// Getting
app.post('/api/users', async (req, res) => {
    const { user, roomCode } = req.body;
    try {
        const values = await chatRoom.findOne({ roomCode: roomCode });
        console.log(values);
        res.json(values);
    } catch (error) {
        console.log("Error from Server", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/api/create', async (req, res) => {
    const { admin, roomName, roomCode } = req.body;
    const newChatRoom = new chatRoom({ admin, roomName, roomCode });
    try {
        const savedRoom = await newChatRoom.save();
        console.log("New chat room added ", savedRoom);
        res.status(201).json('ok');
    } catch (err) {
        console.error('Error creating new Chat room :', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
    console.log('Chat room created:', { admin, roomName, roomCode });
});

// Assuming 'user' and 'admin' collections for triggering
// This is just a placeholder
const MongoClient = require('mongodb').MongoClient;
const dbName = 'test';
MongoClient.connect(DB, function (err, client) {
    if (err) {
        console.error(err);
        return;
    }
    console.log("Connected successfully to server");

    const db = client.db(dbName);

    // Watch the 'user' collection for deletion events
    const userCollection = db.collection('users');
    const changeStream = userCollection.watch();

    changeStream.on('change', async change => {
    if (change.operationType === 'delete') {
      const deletedUsername = change.documentKey.username; // Assuming username is the key
      
      // Check if the user collection is empty
      const count = await userCollection.countDocuments();
      
      if (count === 0) {
        // If user collection is empty, delete corresponding admin data
        adminCollection.deleteOne({ admin_name: deletedUsername }, (err, result) => {
          if (err) {
            console.error(err);
            return;
          }
          console.log(`Deleted corresponding admin document for ${deletedUsername}`);
        });
      }
    }
  });
});

app.listen(PORT, () => console.log('Server Running at the PORT ', PORT));
