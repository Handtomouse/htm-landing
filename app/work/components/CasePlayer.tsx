'use client';
// app/work/components/CasePlayer.tsx
// Client Component: controlled image carousel for case detail.
// Class names match portfolio.css: .player, .player-head, .stage, .p-arrow,
// .info, .strip-row, .strip, .p-thumb
// Plain <img> per locked default #6 (visual fidelity over bundle for v1).
import { useState, useEffect, useCallback } from 'react';
import type { CasePlayerProps } from './types';

export default function CasePlayer({ images, alt }: CasePlayerProps) {
  const [idx, setIdx] = useState(0);
  const total = images.length;

  const go = useCallback((delta: number) => {
    setIdx((cur) => (cur + delta + total) % total);
  }, [total]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowRight') go(1);
      if (e.key === 'ArrowLeft') go(-1);
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [go]);

  if (total === 0) return null;
  const current = images[idx];

  return (
    <div className="player" aria-label={`${alt} artboards`}>
      <div className="player-head">
        <span className="left">
          <span className="dot" aria-hidden="true"></span>
          <span>{alt}</span>
        </span>
        <span className="counter">{String(idx + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
      </div>

      {/* Stage: main image display with prev/next arrows */}
      <div className="stage" id="pStage" role="region" aria-label="Artboard viewer">
        <button
          className="p-arrow prev"
          type="button"
          aria-label="Previous artboard"
          disabled={total <= 1}
          onClick={() => go(-1)}
        >
          &#8249;
        </button>
        <img
          src={current.src}
          alt={current.cap || alt}
          className="stage-img"
        />
        <button
          className="p-arrow next"
          type="button"
          aria-label="Next artboard"
          disabled={total <= 1}
          onClick={() => go(1)}
        >
          &#8250;
        </button>
      </div>

      {/* Info block: caption + index */}
      {current.cap && (
        <div className="info" id="pInfo">
          <span className="info-num">{String(idx + 1).padStart(2, '0')}</span>
          <div className="info-body">
            <span className="info-title">{current.cap}</span>
          </div>
          <div className="info-side">
            <span>{String(idx + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</span>
          </div>
        </div>
      )}

      {/* Thumbnail strip */}
      <div className="strip-row">
        <div className="strip" id="pStrip" role="tablist" aria-label="Artboard thumbnails">
          {images.map((im, i) => (
            <button
              key={im.src}
              type="button"
              role="tab"
              aria-selected={i === idx}
              aria-label={`Artboard ${i + 1}${im.cap ? ': ' + im.cap : ''}`}
              className={`p-thumb${i === idx ? ' active' : ''}`}
              onClick={() => setIdx(i)}
            >
              <span className="t-num">{String(i + 1).padStart(2, '0')}</span>
              <img src={im.src} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
