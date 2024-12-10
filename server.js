const express = require('express');
const connectDB = require('./config/db');
const path = require('path');

const app = express();

const fileUpload = require('express-fileupload');

// Connect Database
connectDB();

// Init Middleware
app.use(express.json());

app.use(
  fileUpload({
    limits: {
      fileSize: 10000000 // Around 10MB
    },
    abortOnLimit: true
  })
);

// Define Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/sports', require('./routes/api/sports'));
app.use('/api/chats', require('./routes/api/chats'));
app.use('/api/messages', require('./routes/api/messages'));
app.use('/api/meetups', require('./routes/api/meetups'));
app.use('/api/timeslots', require('./routes/api/timeslots'));
app.use('/api/media', require('./routes/api/media'));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
