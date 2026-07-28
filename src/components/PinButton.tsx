'use client';

import { useState, useEffect } from 'react';
import { PinnedSchool } from '@/lib/types';

interface PinButtonProps {
  school: {
    id: string;
    institutionName: string;
    type: string;
    region: string;
    city: string;
    state: string;
    heroHeadline: string;
  };
  size?: 'sm' | 'md';
}

export function PinButton({ school, size = 'md' }: PinButtonProps) {
  const [isPinned, setIsPinned] = useState(false);
  const [showNotePrompt, setShowNotePrompt] = useState(false);
  const [note, setNote] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('campusvox_pins');
    if (stored) {
      try {
        const pins: PinnedSchool[] = JSON.parse(stored);
        setIsPinned(pins.some(p => p.id === school.id));
      } catch {}
    }
  }, [school.id]);

  function togglePin() {
    const stored = localStorage.getItem('campusvox_pins');
    let pins: PinnedSchool[] = [];
    try { if (stored) pins = JSON.parse(stored); } catch {}

    if (isPinned) {
      pins = pins.filter(p => p.id !== school.id);
      setIsPinned(false);
      localStorage.setItem('campusvox_pins', JSON.stringify(pins));
    } else {
      setShowNotePrompt(true);
    }
  }

  function confirmPin() {
    const stored = localStorage.getItem('campusvox_pins');
    let pins: PinnedSchool[] = [];
    try { if (stored) pins = JSON.parse(stored); } catch {}

    const newPin: PinnedSchool = {
      id: school.id,
      institutionName: school.institutionName,
      type: school.type,
      region: school.region,
      city: school.city,
      state: school.state,
      heroHeadline: school.heroHeadline,
      note,
      pinnedAt: new Date().toISOString(),
    };

    pins = pins.filter(p => p.id !== school.id);
    pins.unshift(newPin);
    localStorage.setItem('campusvox_pins', JSON.stringify(pins));
    setIsPinned(true);
    setShowNotePrompt(false);
    setNote('');
  }

  const btnStyle = {
    display: 'inline-flex', alignItems: 'center', gap: '5px',
    fontSize: size === 'sm' ? '0.72rem' : '0.82rem',
    fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)',
    padding: size === 'sm' ? '4px 10px' : '7px 14px',
    borderRadius: 'var(--radius)', border: 'none', transition: 'all 0.15s',
    background: isPinned ? 'var(--navy)' : 'var(--parchment-mid)',
    color: isPinned ? '#fff' : 'var(--ink-mid)',
  };

  return (
    <>
      <button onClick={togglePin} style={btnStyle} title={isPinned ? 'Unpin this school' : 'Pin to Pinboard'}>
        📌 {isPinned ? 'Pinned' : 'Pin'}
      </button>

      {/* Note prompt modal */}
      {showNotePrompt && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-lg)', padding: '2rem', width: '100%', maxWidth: '440px' }}>
            <h3 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>Pin {school.institutionName}</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--ink-light)', marginBottom: '1rem' }}>
              Add a note to remember why you pinned this school (optional).
            </p>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="e.g. Great admissions CTA language. Love their Franciscan positioning."
              rows={3}
              autoFocus
              style={{ width: '100%', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '10px 14px', fontSize: '0.9rem', fontFamily: 'var(--font-body)', resize: 'vertical', boxSizing: 'border-box', marginBottom: '1rem' }}
            />
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button onClick={() => { setShowNotePrompt(false); setNote(''); }} style={{ padding: '8px 14px', fontSize: '0.85rem', background: 'none', border: '1px solid var(--border)', borderRadius: 'var(--radius)', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                Cancel
              </button>
              <button onClick={confirmPin} style={{ padding: '8px 20px', fontSize: '0.85rem', background: 'var(--navy)', color: '#fff', border: 'none', borderRadius: 'var(--radius)', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 600 }}>
                Pin it 📌
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
