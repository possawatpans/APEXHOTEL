import { createClient } from '@supabase/supabase-js';

// ดึงค่าจาก .env หรือใส่ URL/Key ของ Supabase ตรงนี้เพื่อทดสอบก่อนได้ครับ
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);