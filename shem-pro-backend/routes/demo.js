const express = require('express');
const router = express.Router();

router.get('/set-demo-cookie', (req, res) => {
  // Set the demo cookie to expire in 24 hours
  res.cookie('demo', 'true', { maxAge: 24 * 60 * 60 * 1000, httpOnly: true });
  res.redirect('http://localhost:5173/dashboard');
});

module.exports = router;