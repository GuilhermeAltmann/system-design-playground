import React from 'react';
import { useChallengeStore } from '../../stores/challenge-store';
import { useCanvasStore } from '../../stores/canvas-store';

export function ChallengeBar() {
  const { activeChallenge } = useChallengeStore();
  const { nodes } = useCanvasStore();

  if (!activeChallenge) return null;

  // Simple validation logic
  const clientNode = nodes.find(n => n.data.type === 'client');
  const currentTraffic = clientNode?.data.properties.requestsPerSecond || 0;
  
  const hasEnoughTraffic = currentTraffic >= activeChallenge.targetReqPerSec;
  
  // Find highest utilization
  let isBottlenecked = false;
  let maxLatency = 0;
  
  nodes.forEach(n => {
    if (n.data.metrics) {
      if (n.data.metrics.utilizationRatio > 1) isBottlenecked = true;
      if (n.data.metrics.latency > maxLatency) maxLatency = n.data.metrics.latency;
    }
  });

  const isLatencyOk = maxLatency <= activeChallenge.maxLatencyMs;
  const isSuccess = hasEnoughTraffic && !isBottlenecked && isLatencyOk;

  return (
    <div style={{
      position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
      background: 'var(--bg-tertiary)', border: `1px solid ${isSuccess ? 'var(--status-healthy)' : 'var(--border-color)'}`,
      padding: '12px 24px', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '24px',
      boxShadow: isSuccess ? '0 0 20px hsla(145, 70%, 50%, 0.2)' : 'var(--shadow-md)', zIndex: 10
    }}>
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>SCENARIO</span>
        <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--accent-primary)' }}>{activeChallenge.title}</span>
      </div>
      
      <div style={{ display: 'flex', gap: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Traffic</span>
          <span style={{ fontSize: '12px', color: hasEnoughTraffic ? 'var(--status-healthy)' : 'var(--status-warning)' }}>
            {currentTraffic.toLocaleString()} / {activeChallenge.targetReqPerSec.toLocaleString()} r/s
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Bottlenecks</span>
          <span style={{ fontSize: '12px', color: !isBottlenecked ? 'var(--status-healthy)' : 'var(--status-critical)' }}>
            {isBottlenecked ? 'Detected' : 'Clear'}
          </span>
        </div>
      </div>

      {isSuccess && (
        <div style={{ background: 'var(--status-healthy)', color: '#000', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>
          Completed! 🎉
        </div>
      )}
    </div>
  );
}
