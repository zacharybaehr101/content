'use client';

import { useState, useEffect } from 'react';
import { PinnedSchool } from '@/lib/types';

export default function PinsPage() {
  const [pins, setPins] = useState<PinnedSchool[]>([]);
  const [noteModal, setNoteModal] = useState<{ id: string; note: string } | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('campusvox_pins');
    if (stored) { try { setPins(JSON.parse(stored)); } catch {} }
    setLoaded(true);
  }, []);

  function savePin(pin: PinnedSchool) {
    const updated = pins.map(p => p.id === pin.id ? pin : p);
    setPins(updated);
    localStorage.setItem('campusvox_pins', JSON.stringify(updated));
  }

  function removePin(id: string) {
    const updated = pins.filter(p => p.id !== id);
    setPins(updated);
    localStorage.setItem('campusvox_pins', JSON.stringify(updated));
  }

  function exportCSV() {
    const rows = [
      ['School', 'Type', 'Region', 'City', 'State', 'Hero Headline', 'Note', 'Pinned Date'],
      ...pins.map(p => [p.institutionName, p.type, p.region, p.city, p.state, p.heroHeadline, p.note, new Date(p.pinnedAt).toLocaleDateString()]),
    ];
    const csv = rows.map(r => r.map(c => `"${(c ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'campusvox-pins.csv'; a.click();
    URL.revokeObjectURL(url);
  }

  if (!loaded) return null;

  return (
    <div style={{ minHeight: '100vh' }}>
      <div style={{ background: 'var(--navy)', padding: '3rem 0 2rem' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
            <div style={{ width: '28px', height: '1px', background: 'var(--red)' }} />
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--red)', letterSpacing: '0.08em' }}>Your Account</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ color: '#fff', fontWeight: 600, fontSize: '2.25rem', marginBottom: '0.5rem' }}>📌 Pinboard</h1>
              <p style={{ color: 'var(--ink-faint)', fontSize: '1rem' }}>
                {pins.length} {pins.length === 1 ? 'school' : 'schools'} pinned
              </p>
            </div>
            {pins.length > 0 && (
              <button onClick={exportCSV} style={{ background: 'transparent', color: 'var(--parchment-dark)', border: '1px solid rgba(255,255,255,0.25)', borderRadius: 'var(--radius)', padding: '8px 16px', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                Export CSV ↓
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '2.5rem 2rem' }}>
        {pins.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem 2rem', maxWidth: '480px', margin: '0 auto' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📌</div>
            <h2 style={{ marginBottom: '0.75rem', fontSize: '1.5rem' }}>Your Pinboard is empty</h2>
            <p style={{ color: 'var(--ink-mid)', lineHeight: 1.7, marginBottom: '1.5rem' }}>
              Pin schools from search results or individual profiles to save them here for quick reference.
            </p>
            <a href="/search" className="btn btn-primary">Browse schools →</a>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
            {pins.map(pin => (
              <div key={pin.id} style={{ background: 'var(--white)', border: '0.5px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '1.5rem', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    <span className="tag tag-red" style={{ fontSize: '0.65rem' }}>📌 Pinned</span>
                    <span className="tag" style={{ fontSize: '0.65rem' }}>{pin.region}</span>
                  </div>
                  <button onClick={() => removePin(pin.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-faint)', fontSize: '1.1rem', padding: '0', lineHeight: 1 }} title="Unpin">×</button>
                </div>

                <a href={`/school/${pin.id}`} style={{ textDecoration: 'none' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--navy)', marginBottom: '6px' }}>{pin.institutionName}</h3>
                </a>
                <p style={{ fontSize: '0.78rem', color: 'var(--ink-faint)', marginBottom: '10px' }}>{pin.city}, {pin.state}</p>

                {pin.heroHeadline && (
                  <div style={{ fontSize: '0.88rem', color: 'var(--navy)', borderLeft: '2px solid var(--red)', paddingLeft: '8px', marginBottom: '12px', lineHeight: 1.4 }}>
                    {pin.heroHeadline.replace(/^"|"$/g, '').slice(0, 80)}
                  </div>
                )}

                {/* Note */}
                {pin.note ? (
                  <div style={{ background: 'var(--parchment-mid)', borderRadius: 'var(--radius)', padding: '10px 12px', marginBottom: '10px' }}>
                    <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--ink-light)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '4px' }}>Your note</div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--ink)', lineHeight: 1.5 }}>{pin.note}</p>
                    <button onClick={() => setNoteModal({ id: pin.id, note: pin.note })} style={{ fontSize: '0.72rem', color: 'var(--red)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginTop: '4px', fontFamily: 'var(--font-body)', fontWeight: 600 }}>
                      Edit note
                    </button>
                  </div>
                ) : (
                  <button onClick={() => setNoteModal({ id: pin.id, note: '' })} style={{ fontSize: '0.82rem', color: 'var(--ink-light)', background: 'var(--parchment-mid)', border: '1px dashed var(--border)', borderRadius: 'var(--radius)', padding: '8px 12px', cursor: 'pointer', fontFamily: 'var(--font-body)', width: '100%', marginBottom: '10px', textAlign: 'left' }}>
                    + Add a note
                  </button>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.7rem', color: 'var(--ink-faint)' }}>
                    Pinned {new Date(pin.pinnedAt).toLocaleDateString()}
                  </span>
                  <a href={`/school/${pin.id}`} style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--navy)', textDecoration: 'none' }}>View profile →</a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Note modal */}
      {noteModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' }}>
          <div style={{ background: 'var(--white)', borderRadius: 'var(--radius-lg)', padding: '2rem', width: '100%', maxWidth: '480px' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>Add a note</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--ink-light)', marginBottom: '1rem' }}>
              {pins.find(p => p.id === noteModal.id)?.institutionName}
            </p>
            <textarea
              value={noteModal.note}
              onChange={e => setNoteModal({ ...noteModal, note: e.target.value })}
              placeholder="e.g. Love their CTA language on admissions page. Great Franciscan positioning."
              rows={4}
              autoFocus
              style={{ width: '100%', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '10px 14px', fontSize: '0.95rem', fontFamily: 'var(--font-body)', resize: 'vertical', boxSizing: 'border-box', marginBottom: '1rem' }}
            />
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button onClick={() => setNoteModal(null)} style={{ padding: '8px 16px', fontSize: '0.88rem', background: 'none', border: '1px solid var(--border)', borderRadius: 'var(--radius)', cursor: 'pointer', fontFamily: 'var(--font-body)' }}>
                Cancel
              </button>
              <button onClick={() => {
                const pin = pins.find(p => p.id === noteModal.id);
                if (pin) savePin({ ...pin, note: noteModal.note });
                setNoteModal(null);
              }} style={{ padding: '8px 20px', fontSize: '0.88rem', background: 'var(--navy)', color: '#fff', border: 'none', borderRadius: 'var(--radius)', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 600 }}>
                Save note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
