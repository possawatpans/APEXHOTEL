import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import ChatWidget from './components/ChatWidget';
import './App.css';

export default function App() {
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);

  // ดึงข้อมูลประเภทห้องพักจาก Supabase
  useEffect(() => {
    fetchRoomTypes();
  }, []);

  async function fetchRoomTypes() {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('room_types').select('*');
      if (error) throw error;
      setRoomTypes(data || []);
    } catch (err) {
      console.error('Error fetching room types:', err.message);
      // ตัวอย่าง Mockup Data สำหรับกรณีทดสอบ UI ก่อนใส่ข้อมูลใน DB
      setRoomTypes([
        {
          id: 1,
          name: 'Presidential Ocean Suite',
          description: 'ห้องสวีทวิวทะเล panoramic 180 องศา พร้อมอ่างอาบน้ำหินอ่อน และบริการ Butler ส่วนตัวตลอด 24 ชั่วโมง',
          price_per_night: 18500,
          capacity: 2,
          image_url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80'
        },
        {
          id: 2,
          name: 'Grand Royal Villa',
          description: 'วิลล่าหรูส่วนตัวพร้อมสระว่ายน้ำอินฟินิตี้ส่วนตัว ตกแต่งด้วยเฟอร์นิเจอร์นำเข้าสไตล์คลาสสิกร่วมสมัย',
          price_per_night: 28000,
          capacity: 4,
          image_url: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80'
        },
        {
          id: 3,
          name: 'Executive Deluxe Room',
          description: 'สัมผัสการพักผ่อนอันเงียบสงบ ตอบโจทย์การเดินทางทั้งพักผ่อนและธุรกิจ ด้วยเตียงระดับ Premium King Size',
          price_per_night: 9500,
          capacity: 2,
          image_url: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80'
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="luxury-app">
      {/* Navbar */}
      <header className="navbar">
        <div className="nav-container">
          <div className="brand">
            <span className="brand-logo">APEX</span>
            <span className="brand-sub">HOTEL & RESORT</span>
          </div>
          <nav className="nav-links">
            <a href="#hero">Home</a>
            <a href="#rooms">Suites & Villas</a>
            <a href="#amenities">Experiences</a>
            <a href="#contact">Contact</a>
          </nav>
          <button className="btn-gold-outline">Reserve Now</button>
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero" className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <p className="hero-subtitle">WELCOME TO APEX HOTEL</p>
          <h1 className="hero-title">Unrivaled Luxury & Timeless Elegance</h1>
          <p className="hero-desc">
            เปิดประสบการณ์พักผ่อนระดับเวิลด์คลาส ท่ามกลางบรรยากาศเหนือกาลเวลาและการบริการระดับพรีเมียม
          </p>

          {/* Quick Search Bar */}
          <div className="search-bar">
            <div className="search-field">
              <label>CHECK-IN</label>
              <input type="date" />
            </div>
            <div className="search-divider"></div>
            <div className="search-field">
              <label>CHECK-OUT</label>
              <input type="date" />
            </div>
            <div className="search-divider"></div>
            <div className="search-field">
              <label>GUESTS</label>
              <select>
                <option>1 Adult</option>
                <option>2 Adults</option>
                <option>4 Adults (Family Suite)</option>
              </select>
            </div>
            <button className="btn-gold-fill">CHECK AVAILABILITY</button>
          </div>
        </div>
      </section>

      {/* Rooms Showcase Section */}
      <section id="rooms" className="rooms-section">
        <div className="section-header">
          <span className="section-subtitle">ACCOMMODATIONS</span>
          <h2 className="section-title">Exclusive Suites & Sanctuary</h2>
          <div className="gold-divider"></div>
        </div>

        {loading ? (
          <div className="loading-state">Loading sanctuary details...</div>
        ) : (
          <div className="rooms-grid">
            {roomTypes.map((room) => (
              <div key={room.id} className="room-card">
                <div className="room-image-wrapper">
                  <img src={room.image_url} alt={room.name} />
                  <span className="room-badge">THB {room.price_per_night.toLocaleString()} / Night</span>
                </div>
                <div className="room-info">
                  <span className="room-capacity">Up to {room.capacity} Guests</span>
                  <h3 className="room-name">{room.name}</h3>
                  <p className="room-desc">{room.description}</p>
                  <div className="room-actions">
                    <button className="btn-room-details" onClick={() => setSelectedRoom(room)}>
                      View Details
                    </button>
                    <button className="btn-gold-fill">Book This Suite</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Experience / Amenities Section */}
      <section id="amenities" className="amenities-section">
        <div className="section-header">
          <span className="section-subtitle">THE APEX EXPERIENCE</span>
          <h2 className="section-title">Curated Privileges</h2>
          <div className="gold-divider"></div>
        </div>

        <div className="amenities-grid">
          <div className="amenity-card">
            <div className="amenity-icon">✨</div>
            <h4>Michelin Dining</h4>
            <p>ดื่มด่ำกับอาหารรังสรรค์โดยเชฟระดับมิชลินสตาร์ พร้อมไวน์คอลเลกชันหายาก</p>
          </div>
          <div className="amenity-card">
            <div className="amenity-icon">🕊️</div>
            <h4>Royal Wellness Spa</h4>
            <p>ผ่อนคลายร่างกายและจิตใจด้วยทรีตเมนต์สปาระดับไฮเอนด์และการบำบัดด้วยสมุนไพรโบราณ</p>
          </div>
          <div className="amenity-card">
            <div className="amenity-icon">⛵</div>
            <h4>Private Yacht Charter</h4>
            <p>บริการล่องเรือยอชต์ส่วนตัวชมพระอาทิตย์ตกดิน พร้อมบัตเลอร์คอยดูแลตลอดทริป</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="luxury-footer">
        <div className="footer-content">
          <div className="brand">
            <span className="brand-logo">APEX</span>
            <span className="brand-sub">HOTEL & RESORT</span>
          </div>
          <p>© 2026 APEX HOTEL & RESORT. ALL RIGHTS RESERVED.</p>
        </div>
      </footer>

      {/* AI Chat Bot Floating Component */}
      <ChatWidget />
    </div>
  );
}