const express = require('express');
const cors = require('cors');
const { chatWithHotelAI } = require('./aiService');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
  try {
    const { message, customerId } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'กรุณาระบุข้อความ' });
    }

    const reply = await chatWithHotelAI(message, customerId);
    res.json({ success: true, reply });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});