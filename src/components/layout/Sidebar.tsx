import React from 'react';
import { COMPONENT_CATALOG } from '../../config/component-catalog';
import { Server, Database, Smartphone, HardDrive, Inbox, Layers, Network, Cpu } from 'lucide-react';
import type { ComponentType } from '../../types';

const ICON_MAP: Record<ComponentType, React.ReactNode> = {
  client: <Smartphone size={16} />,
  service: <Server size={16} />,
  database: <Database size={16} />,
  cache: <Layers size={16} />,
  queue: <Inbox size={16} />,
  storage: <HardDrive size={16} />,
  load_balancer: <Network size={16} />,
  worker: <Cpu size={16} />,
};

const COLOR_MAP: Record<ComponentType, string> = {
  client: '#4facf7',
  service: '#f7a84f',
  database: '#f74f4f',
  cache: '#a84ff7',
  queue: '#4ff7a8',
  storage: '#f7f74f',
  load_balancer: '#f74f9d',
  worker: '#f7884f',
};

export function Sidebar() {
  const onDragStart = (event: React.DragEvent, nodeData: any) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify(nodeData));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside style={{ width: '250px', background: 'var(--bg-secondary)', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)' }}>
        <h2 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)' }}>Components</h2>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {COMPONENT_CATALOG.map((item) => (
          <div
            key={item.type}
            onDragStart={(event) => onDragStart(event, item.defaultData)}
            draggable
            className="glass-panel"
            style={{
              padding: '12px',
              borderRadius: '8px',
              cursor: 'grab',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              borderLeft: `3px solid ${COLOR_MAP[item.type]}`
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', fontSize: '14px', fontWeight: 500 }}>
              <span style={{ color: COLOR_MAP[item.type] }}>{ICON_MAP[item.type]}</span>
              {item.label}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              {item.description}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
