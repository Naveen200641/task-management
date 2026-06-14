const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app);

// Socket.io configuration
const io = socketio(server, {
  cors: {
    origin: '*', // Dynamic CORS or '*' for local cross-origin development
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

// Store Socket.io instance on express app configuration
app.set('socketio', io);

// Middlewares
app.use(cors());
app.use(express.json());

// Load API routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));

// Basic health route
app.get('/', (req, res) => {
  res.send('TaskFlow Server is running successfully.');
});

// Fallback Route Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Socket Connection handling
io.on('connection', (socket) => {
  console.log(`Socket Connection established: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`Socket Disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server executing on port ${PORT}`);
});
