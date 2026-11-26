import { GoogleGenAI } from '@google/genai';
import { supabase } from './db.js';
import dotenv from 'dotenv';

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function chatWithHotelAI(userPrompt) {
  try {
    const { data: roomTypes } = await supabase.from('room_types').select('*');

    const systemInstruction = `คุณคือผู้ช่วย AI ประจำโรงแรม APEX Hotel & Resort ตอบคำถามลูกค้าด้วยความเป็นมิตร สุภาพ และกระชับ
ข้อมูลประเภทห้องพักที่มีในระบบขณะนี้:
${JSON.stringify(roomTypes || [], null, 2)}`;

    // ใช้โมเดลจาก .env หรือ fallback เป็น gemini-2.5-flash
    const modelName = process.env.LLM_MODEL || 'gemini-3.5-flash-lite';

    const response = await ai.models.generateContent({
      model: modelName,
      contents: [
        { role: 'user', parts: [{ text: `${systemInstruction}\n\nคำถามจากลูกค้า: ${userPrompt}` }] }
      ]
    });

    return response.text;
  } catch (error) {
    console.error('AI Service Error:', error);
    return 'ขออภัยครับ ขณะนี้ระบบ AI ไม่สามารถประมวลผลได้ กรุณาลองใหม่อีกครั้ง';
  }
}