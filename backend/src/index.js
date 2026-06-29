const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { WebSocketServer } = require('ws');
require('dotenv').config();

const Response = require('./models/Response');
const Session = require('./models/Session');

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'CrowdCast server is running!' });
});

// Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const presentationRoutes = require('./routes/presentationRoutes');
app.use('/api/presentations', presentationRoutes);

const slideRoutes = require('./routes/slideRoutes');
app.use('/api/presentations/:presentationId/slides', slideRoutes);

const sessionRoutes = require('./routes/sessionRoutes');
app.use('/api/presentations/:presentationId/sessions', sessionRoutes);

const responseRoutes = require('./routes/responseRoutes');
app.use('/api/sessions/:sessionId/responses', responseRoutes);

const aiRoutes = require('./routes/aiRoutes');
app.use('/api/ai', aiRoutes);

// MongoDB connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected!'))
  .catch((err) => console.log('DB error:', err));

// WebSocket
const rooms = {}; // { sessionCode: [ws1, ws2, ...] }

wss.on('connection', (ws) => {
  console.log('User connected!');

  ws.on('message', async (data) => {
    console.log("RAW:", data.toString());
    const message = JSON.parse(data);

    // Audience/Presenter joins a room
    if (message.type === 'session:join') {
      const { code, role } = message;
      ws.code = code;
      ws.role = role;

      if (!rooms[code]) rooms[code] = [];
      rooms[code].push(ws);

      console.log(`${role} joined room ${code}`);

      ws.send(JSON.stringify({
        type: 'session:joined',
        message: `Joined room ${code}`
      }));
    }

    // Presenter changes slide
    if (message.type === 'slide:change') {
      const { code, slideIndex, slide } = message;

      rooms[code]?.forEach((client) => {
        if (client !== ws && client.readyState === 1) {
          client.send(JSON.stringify({
            type: 'slide:change',
            slideIndex,
            slide
          }));
        }
      });
    }

    // Audience submits answer
    if (message.type === 'answer:submit') {
      const { code, slideId, answer, participantId } = message;

      try {
        const session = await Session.findOne({ code });
        if (!session) return;

        // Check if this participant already answered this slide
        const existing = await Response.findOne({
          sessionId: session._id,
          slideId,
          participantId
        });

        if (existing) {
          existing.answer = answer; // update vote
          await existing.save();
        } else {
          await Response.create({
            sessionId: session._id,
            slideId,
            participantId,
            answer
          });
        }

        // Calculate live results
        const allResponses = await Response.find({ sessionId: session._id, slideId });
        const results = {};
        allResponses.forEach((r) => {
          results[r.answer] = (results[r.answer] || 0) + 1;
        });

        // Broadcast results to everyone in room (presenter + audience)
        rooms[code]?.forEach((client) => {
          if (client.readyState === 1) {
            client.send(JSON.stringify({
              type: 'results:update',
              slideId,
              results,
              totalVotes: allResponses.length
            }));
          }
        });

      } catch (err) {
        console.log('Answer submit error:', err);
      }
    }
  });

  ws.on('close', () => {
    // Remove from room
    if (ws.code && rooms[ws.code]) {
      rooms[ws.code] = rooms[ws.code].filter((client) => client !== ws);
      console.log(`User left room ${ws.code}`);
    }
  });
});

// Server start
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});