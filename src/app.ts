import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';

import * as middlewares from './middlewares';
import api from './api';
import MessageResponse from './interfaces/MessageResponse';

require('dotenv').config();

const app = express();

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  },
});

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

io.on('connection', (socket) => {
  console.log(`user ${socket.id} connected`);

  socket.on('disconnect', () => {
    console.log(`user ${socket.id} disconnected`);
  });

  socket.on('chat message', (msg) => {
    console.log('message:', msg);
    io.emit('chat message', msg);
  });
});

app.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: '🦄🌈✨👋🌎🌍🌏✨🌈🦄',
  });
});

app.use('/api/v1', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default httpServer;
