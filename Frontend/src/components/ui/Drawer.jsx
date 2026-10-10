import React, { useEffect } from 'react';

export function Drawer({ isOpen, onClose, title, children }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    const mainEl = document.getElementById('main-content');

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if (mainEl) mainEl.setAttribute('inert', '');
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
      if (mainEl) mainEl.removeAttribute('inert');
    }
    return () => {
      document.body.style.overflow = '';
      if (mainEl) mainEl.removeAttribute('inert');
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title || 'Panel Samping'}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999,
        display: 'flex',
        justifyContent: 'flex-end',
      }}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(74, 59, 50, 0.45)',
          backdropFilter: 'blur(2px)',
          animation: 'fadeIn 180ms ease',
        }}
      />

      {/* Drawer Container */}
      <aside
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '440px',
          height: '100%',
          backgroundColor: 'var(--cream-100)',
          boxShadow: 'var(--shadow-modal)',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1000,
          animation: 'slideInRight 220ms ease',
        }}
      >
        <header
          style={{
            padding: 'var(--space-4) var(--space-6)',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <h2 style={{ fontSize: 'var(--fs-h3)', margin: 0 }}>{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup panel"
            className="btn-icon"
            style={{
              fontSize: '1.25rem',
              width: '44px',
              height: '44px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ✕
          </button>
        </header>

        <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-6)' }}>
          {children}
        </div>
      </aside>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}
