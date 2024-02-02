import React from 'react';
import './Profile.css'

function Modal({ isOpen, onClose }) {
    if (!isOpen) return null;
  
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
        <div style={{ maxWidth: '500px', margin: '0 auto', background: 'white', padding: '20px' }}>
          <button onClick={onClose}>Close</button>
          {/* Содержимое модального окна */}
        </div>
      </div>
    );
  }
  
  export default Modal