import React, { useState } from 'react';

export function ProductGallery({ images, name }) {
  const imageList = images && images.length > 0 ? images : [
    'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80',
  ];
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      {/* Main Image */}
      <div
        style={{
          width: '100%',
          paddingTop: '85%', // aspect ratio
          position: 'relative',
          backgroundColor: 'var(--cream-200)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          border: '1px solid var(--color-border)',
        }}
      >
        <img
          src={imageList[activeIndex]}
          alt={`${name} - Tampilan ${activeIndex + 1}`}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </div>

      {/* Thumbnails */}
      {imageList.length > 1 && (
        <div style={{ display: 'flex', gap: 'var(--space-3)', overflowX: 'auto', paddingBottom: 'var(--space-2)' }}>
          {imageList.map((img, idx) => {
            const isSelected = idx === activeIndex;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                aria-label={`Pilih foto ${idx + 1}`}
                style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: 'var(--radius-sm)',
                  overflow: 'hidden',
                  padding: 0,
                  border: isSelected
                    ? '2px solid var(--color-accent)'
                    : '1px solid var(--color-border)',
                  opacity: isSelected ? 1 : 0.7,
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'opacity var(--transition-fast)',
                }}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
