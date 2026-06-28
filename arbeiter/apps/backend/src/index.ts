import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { WebSocketServer, WebSocket } from 'ws';
import http from 'http';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

// REST API Routes
app.get('/api/opportunities', async (req, res) => {
  try {
    const opportunities = await prisma.opportunity.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { lastSeenAt: 'desc' },
      include: { platform: true },
      take: 100, // Limit for MVP
    });
    res.json(opportunities);
  } catch (error) {
    console.error('Error fetching opportunities:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/platforms', async (req, res) => {
  try {
    const platforms = await prisma.platform.findMany({
      where: { status: 'ACTIVE' }
    });
    res.json(platforms);
  } catch (error) {
    console.error('Error fetching platforms:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// WebSocket Server for Real-Time Updates
wss.on('connection', (ws: WebSocket) => {
  console.log('Client connected');
  
  ws.on('message', (message) => {
    // Handle client filters or auth here later
    console.log('received: %s', message);
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
