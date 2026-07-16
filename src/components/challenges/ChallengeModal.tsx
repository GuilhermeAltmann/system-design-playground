import React, { useState } from 'react';
import { Trophy, X } from 'lucide-react';
import { CHALLENGES } from '../../config/challenges';
import { useChallengeStore } from '../../stores/challenge-store';

export function ChallengeModal({ onClose }: { onClose: () => void }) {
  const { setActiveChallenge } = useChallengeStore();

  const handleSelect = (id: string) => {
    setActiveChallenge(id);
    onClose();
  };

  return (
    <div style={{
      position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000
    }}>
      <div className="glass-panel" style={{
        width: '600px', padding: '24px', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '16px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Trophy color="var(--accent-primary)" />
            Select a Scenario
          </h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}>
            <X size={24} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {CHALLENGES.map(c => (
            <div key={c.id} 
              style={{
                padding: '16px', background: 'var(--bg-tertiary)', borderRadius: '8px',
                border: '1px solid var(--border-color)', cursor: 'pointer', transition: 'all 0.2s'
              }}
              onClick={() => handleSelect(c.id)}
              onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
              onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
            >
              <h3 style={{ fontSize: '16px', color: 'var(--accent-primary)', marginBottom: '4px' }}>{c.title}</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{c.description}</p>
              <div style={{ marginTop: '12px', display: 'flex', gap: '8px' }}>
                <span style={{ fontSize: '11px', background: 'var(--bg-primary)', padding: '2px 8px', borderRadius: '4px' }}>
                  🎯 {c.targetReqPerSec.toLocaleString()} req/s
                </span>
                <span style={{ fontSize: '11px', background: 'var(--bg-primary)', padding: '2px 8px', borderRadius: '4px' }}>
                  ⚡ &lt; {c.maxLatencyMs}ms
                </span>
              </div>
            </div>
          ))}
          <div
              style={{
                padding: '16px', background: 'var(--bg-tertiary)', borderRadius: '8px',
                border: '1px solid var(--border-color)', cursor: 'pointer', textAlign: 'center'
              }}
              onClick={() => handleSelect('none')}
            >
              <h3 style={{ fontSize: '14px', color: 'var(--text-primary)' }}>Free Mode (No Constraints)</h3>
            </div>
        </div>
      </div>
    </div>
  );
}
