import React from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import { Server, Database, Smartphone, HardDrive, Inbox, Layers, Network, Cpu } from 'lucide-react';
import type { NodeData, ComponentType } from '../../types';
import './BaseNode.css';

const ICON_MAP: Record<ComponentType, React.ReactNode> = {
  client: <Smartphone size={20} />,
  service: <Server size={20} />,
  database: <Database size={20} />,
  cache: <Layers size={20} />,
  queue: <Inbox size={20} />,
  storage: <HardDrive size={20} />,
  load_balancer: <Network size={20} />,
  worker: <Cpu size={20} />,
};

const COLOR_MAP: Record<ComponentType, string> = {
  client: '#4facf7',
  service: '#f7a84f',
  database: '#f74f4f',
  cache: '#a84ff7',
  queue: '#4ff7a8',
  storage: '#f7f74f',
  load_balancer: '#f74f9d', // Pinkish
  worker: '#f7884f', // Orange-red
};

export function BaseNode({ data, isConnectable }: NodeProps<NodeData>) {
  const { label, type, metrics } = data;
  const utilization = metrics?.utilizationRatio || 0;
  
  // Color the border based on utilization
  let statusClass = 'healthy';
  if (utilization >= 0.85) statusClass = 'warning';
  if (utilization >= 1.0) statusClass = 'critical';

  return (
    <div className={`base-node glass-panel status-${statusClass}`}>
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
        className="node-handle"
      />
      
      <div className="node-header">
        <div className="node-icon" style={{ color: COLOR_MAP[type] }}>
          {ICON_MAP[type]}
        </div>
        <div className="node-title">{label}</div>
      </div>

      {metrics && (
        <div className="node-metrics">
          <div className="metric-row">
            <span>Throughput:</span>
            <span>{Math.round(metrics.throughput).toLocaleString()} req/s</span>
          </div>
          <div className="metric-row">
            <span>Latency:</span>
            <span>{metrics.latency.toFixed(1)} ms</span>
          </div>
          
          <div className="progress-container">
            <div 
              className="progress-bar" 
              style={{ width: `${Math.min(utilization * 100, 100)}%` }}
            />
          </div>
          
          {metrics.bottleneckReason && utilization >= 1 && (
            <div className="bottleneck-alert">
              {metrics.bottleneckReason}
            </div>
          )}
        </div>
      )}

      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
        className="node-handle"
      />
    </div>
  );
}
