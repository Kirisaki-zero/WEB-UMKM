import React from 'react';

export function Toast({ message }) {
  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        bottom: 'var(--space-6)',
        right: 'var(--space-6)',
        backgroundColor: 'var(--brown-900)',
        color: 'var(--cream-100)',
        padding: 'var(--space-3) var(--space-5)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-hover)',
        fontSize: 'var(--fs-small)',
        fontWeight: 500,
        zIndex: 1100,
        maxWidth: '90vw',
        animation: 'slideUp 180ms ease',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-2)',
      }}
    >
      <span style={{ color: 'var(--green-600)', fontWeight: 'bold' }}>✓</span>
      <span>{message}</span>
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(12px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}
