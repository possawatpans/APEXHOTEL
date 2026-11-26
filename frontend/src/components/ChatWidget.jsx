import React, { useState, useRef, useEffect } from 'react';

// ดึงค่า VITE_BACKEND_URL หากไม่พบให้ใช้ Fallback เป็น URL บน Vercel โดยตรง
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'https://apexhotel-lemon.vercel.app';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: 'สวัสดีครับ APEX AI Assistant ยินดีให้บริการ สอบถามข้อมูลห้องพัก หรือบริการของโรงแรมได้เลยครับ'
    }
  ]);

  const messagesEndRef = useRef(null);

  // เลื่อนหน้าต่างแชตลงล่างสุดอัตโนมัติเมื่อมีข้อความใหม่
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');

    // แสดงข้อความของผู้ใช้ทันที
    setMessages((prev) => [...prev, { sender: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: userMessage })
      });

      const data = await response.json();

      if (response.ok && data.reply) {
        setMessages((prev) => [...prev, { sender: 'ai', text: data.reply }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: 'ai', text: 'ไม่สามารถติดต่อเซิร์ฟเวอร์ AI ได้ในขณะนี้' }
        ]);
      }
    } catch (error) {
      console.error('Chat API Error:', error);
      setMessages((prev) => [
        ...prev,
        { sender: 'ai', text: 'ไม่สามารถติดต่อเซิร์ฟเวอร์ AI ได้ในขณะนี้' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999 }}>
      {/* ปุ่มเปิด/ปิด แชต */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            padding: '12px 20px',
            backgroundColor: '#c5a880',
            color: '#1a1a1a',
            border: 'none',
            borderRadius: '25px',
            fontWeight: 'bold',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
          }}
        >
          💬 APEX Assistant
        </button>
      )}

      {/* หน้าต่างแชต */}
      {isOpen && (
        <div
          style={{
            width: '350px',
            height: '480px',
            backgroundColor: '#14171f',
            border: '1px solid #c5a880',
            borderRadius: '12px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
          }}
        >
          {/* ส่วนหัว (Header) */}
          <div
            style={{
              padding: '14px 16px',
              backgroundColor: '#1f2430',
              borderBottom: '1px solid #2a3142',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              color: '#c5a880',
              fontWeight: 'bold'
            }}
          >
            <span>APEX Hotel AI</span>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: '#aaa',
                fontSize: '18px',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>
          </div>

          {/* รายการข้อความ (Messages List) */}
          <div
            style={{
              flex: 1,
              padding: '16px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                style={{
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '80%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  fontSize: '14px',
                  lineHeight: '1.4',
                  backgroundColor: msg.sender === 'user' ? '#c5a880' : '#2a3142',
                  color: msg.sender === 'user' ? '#1a1a1a' : '#ffffff',
                  wordBreak: 'break-word'
                }}
              >
                {msg.text}
              </div>
            ))}
            {isLoading && (
              <div
                style={{
                  alignSelf: 'flex-start',
                  color: '#888',
                  fontSize: '13px',
                  fontStyle: 'italic'
                }}
              >
                กำลังพิมพ์...
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* ฟอร์มกรอกข้อความส่ง */}
          <form
            onSubmit={handleSendMessage}
            style={{
              padding: '12px',
              backgroundColor: '#1f2430',
              borderTop: '1px solid #2a3142',
              display: 'flex',
              gap: '8px'
            }}
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="พิมพ์คำถาม..."
              autoComplete="off"
              disabled={isLoading}
              style={{
                flex: 1,
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #3b4252',
                backgroundColor: '#14171f',
                color: '#fff',
                fontSize: '14px',
                outline: 'none'
              }}
            />
            <button
              type="submit"
              disabled={isLoading}
              style={{
                padding: '8px 16px',
                backgroundColor: '#c5a880',
                color: '#1a1a1a',
                border: 'none',
                borderRadius: '6px',
                fontWeight: 'bold',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.6 : 1
              }}
            >
              ส่ง
            </button>
          </form>
        </div>
      )}
    </div>
  );
}