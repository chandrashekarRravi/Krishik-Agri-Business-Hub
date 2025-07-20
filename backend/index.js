import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import productsRoutes from './routes/products.js';
import authRoutes from './routes/auth.js';
import ordersRoutes from './routes/orders.js';
import os from 'os';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/products', productsRoutes);

// Health check route for root
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Backend server is healthy and running',
    time: new Date().toISOString()
  });
});

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/krishik-agri';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected successfully');
    app.listen(PORT, () => {
      // Display backend server link in terminal
      function getLocalExternalIP() {
        const interfaces = os.networkInterfaces();
        for (const name of Object.keys(interfaces)) {
          for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
              return iface.address;
            }
          }
        }
        return 'localhost';
      }
      const localIP = getLocalExternalIP();
      console.log(`🚀 Backend server is running at:`);
      console.log(`   Local:   http://localhost:${PORT}`);
      console.log(`   Network: http://${localIP}:${PORT}`);
    });
  })
  .catch((err) => console.error('MongoDB connection error:', err)); 