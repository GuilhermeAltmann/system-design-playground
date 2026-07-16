import React from 'react';
import { BaseEdge, getBezierPath } from '@xyflow/react';
import type { EdgeProps } from '@xyflow/react';
import type { EdgeData } from '../../types';
import { useCanvasStore } from '../../stores/canvas-store';

export function TrafficEdge(props: EdgeProps<EdgeData>) {
  const {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd,
    data,
  } = props;

  const deleteEdge = useCanvasStore(s => s.deleteEdge);

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // Calculate flow speed and color based on traffic and bottleneck status
  const traffic = data?.traffic || 0;
  const isBottleneck = data?.isBottleneck || false;

  let stroke = 'var(--text-secondary)';
  let animationSpeed = '0s'; // static if no traffic
  
  if (traffic > 0) {
    stroke = 'var(--status-healthy)';
    // Higher traffic = faster animation (min 0.5s, max 2s)
    const speed = Math.max(0.5, 2 - (traffic / 10000));
    animationSpeed = `${speed}s`;
  }

  if (isBottleneck) {
    stroke = 'var(--status-critical)';
    // When bottlenecked, flow animation might be slow/clogged
    animationSpeed = '3s';
  }

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          strokeWidth: Math.min(10, Math.max(2, traffic / 5000)), // dynamic width
          stroke,
          opacity: 0.6,
        }}
      />
      {traffic > 0 && (
        <circle r="4" fill={stroke}>
          <animateMotion 
            dur={animationSpeed} 
            repeatCount="indefinite" 
            path={edgePath} 
          />
        </circle>
      )}
      
      {/* Label for traffic volume & Delete Button */}
      <foreignObject
        width={120}
        height={30}
        x={labelX - 60}
        y={labelY - 15}
        requiredExtensions="http://www.w3.org/1999/xhtml"
      >
        <div style={{
          background: 'var(--bg-primary)',
          borderRadius: '4px',
          padding: '2px 4px',
          border: `1px solid ${stroke}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          width: 'fit-content',
          margin: '0 auto'
        }}>
          {traffic > 0 && (
            <span style={{ color: stroke, fontSize: '10px', fontWeight: 'bold' }}>
              {Math.round(traffic).toLocaleString()} r/s
            </span>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); deleteEdge(id); }}
            style={{
              background: 'var(--bg-secondary)', border: 'none', color: 'var(--status-critical)', 
              cursor: 'pointer', fontSize: '10px', padding: '2px 4px', borderRadius: '2px', fontWeight: 'bold'
            }}
            title="Delete Edge"
          >
            ✕
          </button>
        </div>
      </foreignObject>
    </>
  );
}
