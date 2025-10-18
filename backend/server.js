require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const performanceRoutes = require('./routes/performance');
const aiRoutes = require('./routes/ai');

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB (fallback to env in db.js as well)
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected from server.js'))
  .catch(err => console.error('MongoDB connect error:', err));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api', performanceRoutes);
app.use('/api', aiRoutes);

// Serve static frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/public')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend/public', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
