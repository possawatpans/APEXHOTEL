import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { chatWithHotelAI } from './aiService.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// เพิ่ม Route หน้าแรกเพื่อยิง Test บน Vercel
app.get('/', (req, res) => {
  res.send('APEX Hotel Backend API is running!');
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'กรุณาระบุข้อความ' });

    const reply = await chatWithHotelAI(message);
    res.json({ success: true, reply });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export default app;