import { GoogleGenAI } from '@google/genai';
import { supabase } from './db.js';
import dotenv from 'dotenv';

dotenv.config();

const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
  : null;

export async function chatWithHotelAI(userPrompt) {
  try {
    if (!ai) {
      console.error('Missing GEMINI_API_KEY');
      return 'ขออภัยครับ ระบบ AI ยังไม่ได้ตั้งค่า กรุณาติดต่อผู้ดูแลระบบ';
    }

    // ดึงข้อมูลห้องพัก (ถ้า Supabase ยังไม่ได้ตั้งค่า หรือดึงไม่ได้ ก็ยังตอบต่อได้)
    let roomTypes = [];
    if (supabase) {
      const { data, error } = await supabase.from('room_types').select('*');
      if (error) console.error('Supabase Error:', error.message);
      else roomTypes = data || [];
    }

    const systemInstruction = `คุณคือผู้ช่วย AI ประจำโรงแรม APEX Hotel & Resort ตอบคำถามลูกค้าด้วยความเป็นมิตร สุภาพ และกระชับ
ข้อมูลประเภทห้องพักที่มีในระบบขณะนี้:
${JSON.stringify(roomTypes, null, 2)}`;

    // ใช้โมเดลจาก .env หรือ fallback เป็น gemini-3.5-flash-lite
    const modelName = process.env.LLM_MODEL || 'gemini-3.5-flash-lite';

    const response = await ai.models.generateContent({
      model: modelName,
      contents: [
        {
          role: 'user',
          parts: [{ text: `${systemInstruction}\n\nคำถามจากลูกค้า: ${userPrompt}` }]
        }
      ]
    });

    return response.text;
  } catch (error) {
    console.error('AI Service Error:', error);
    return 'ขออภัยครับ ขณะนี้ระบบ AI ไม่สามารถประมวลผลได้ กรุณาลองใหม่อีกครั้ง';
  }
}