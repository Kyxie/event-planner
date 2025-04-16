import express from 'express';
const router = express.Router();

// GET /
router.get('/api', (req, res) => {
  res.json({ message: '🚀 API is running' });
});

export default router;
