import React, { useState } from 'react';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'สวัสดีครับ APEX AI Assistant ยินดีให้บริการ สอบถามข้อมูลห้องพักได้เลยครับ' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setInput('');

    try {
      // ยิงไปที่ Backend Express API (Port 5000)
      const res = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg })
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { sender: 'ai', text: data.reply || 'ขออภัย ไม่สามารถประมวลผลได้' }]);
    } catch (err) {
      setMessages((prev) => [...prev, { sender: 'ai', text: 'ไม่สามารถติดต่อเซิร์ฟเวอร์ AI ได้ในขณะนี้' }]);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999 }}>
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            background: '#C5A880',
            color: '#12161A',
            border: 'none',
            padding: '14px 22px',
            borderRadius: '30px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(0,0,0,0.4)'
          }}
        >
          💬 AI Assistant
        </button>
      ) : (
        <div
          style={{
            width: '340px',
            height: '450px',
            background: '#1A1F26',
            border: '1px solid #C5A880',
            borderRadius: '12px',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 10px 25px rgba(0,0,0,0.5)'
          }}
        >
          <div
            style={{
              background: '#12161A',
              padding: '12px 16px',
              borderBottom: '1px solid rgba(197, 168, 128, 0.3)',
              display: 'flex',
              justify: 'space-between',
              alignItems: 'center',
              color: '#C5A880',
              fontWeight: 'bold'
            }}
          >
            <span>APEX Hotel AI</span>
            <button
              onClick={() => setIsOpen(false)}
              style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
            >
              ✕
            </button>
          </div>
          <div style={{ flex: 1, padding: '12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                  background: m.sender === 'user' ? '#C5A880' : '#2A303C',
                  color: m.sender === 'user' ? '#12161A' : '#F9F8F6',
                  padding: '8px 12px',
                  borderRadius: '10px',
                  maxWidth: '80%',
                  fontSize: '0.85rem'
                }}
              >
                {m.text}
              </div>
            ))}
          </div>
          <div style={{ padding: '10px', display: 'flex', gap: '6px', borderTop: '1px solid rgba(197,168,128,0.2)' }}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="พิมพ์คำถาม..."
              style={{ flex: 1, background: '#12161A', border: '1px solid #333', color: '#fff', padding: '8px', borderRadius: '4px' }}
            />
            <button onClick={handleSend} style={{ background: '#C5A880', border: 'none', padding: '0 12px', borderRadius: '4px', cursor: 'pointer' }}>
              ส่ง
            </button>
          </div>
        </div>
      )}
    </div>
  );
}