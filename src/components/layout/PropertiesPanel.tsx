import React from 'react';
import { useCanvasStore } from '../../stores/canvas-store';
import { COMPONENT_CATALOG } from '../../config/component-catalog';

export function PropertiesPanel() {
  const { nodes, updateNodeData, deleteNode } = useCanvasStore();
  const selectedNode = nodes.find(n => n.selected);

  if (!selectedNode) {
    return (
      <aside style={{ width: '300px', background: 'var(--bg-secondary)', borderLeft: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)' }}>Properties</h2>
        </div>
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', textAlign: 'center' }}>Select a component on the canvas to view and edit its properties.</p>
        </div>
      </aside>
    );
  }

  const { id, data } = selectedNode;
  const { properties } = data;
  
  // Find catalog reference to know what fields to show (simplified for now)
  const handleChange = (key: string, value: any) => {
    updateNodeData(id, {
      properties: {
        ...properties,
        [key]: value
      }
    });
  };

  const inputStyles = {
    background: 'var(--bg-primary)', 
    border: '1px solid var(--border-color)', 
    color: 'var(--text-primary)',
    padding: '8px',
    borderRadius: '4px',
    fontSize: '13px'
  };

  const getEngineOptions = (type: string) => {
    switch (type) {
      case 'database': return ['postgresql', 'mysql', 'mongodb', 'cassandra'];
      case 'service': return ['nodejs', 'go', 'java'];
      case 'worker': return ['nodejs', 'go', 'java', 'python'];
      case 'cache': return ['redis', 'memcached'];
      case 'queue': return ['kafka', 'rabbitmq', 'sqs'];
      default: return [];
    }
  };

  return (
    <aside style={{ width: '300px', background: 'var(--bg-secondary)', borderLeft: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)' }}>
        <h2 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>
          {data.label} Properties
        </h2>
        <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>ID: {id}</p>
      </div>
      
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Component Name</label>
          <input 
            type="text" 
            value={data.label}
            onChange={(e) => updateNodeData(id, { label: e.target.value })}
            style={inputStyles}
          />
        </div>
        
        {Object.entries(properties).map(([key, value]) => {
          if (key === 'latencyMs') return null; // skip latency edit for simplicity in UI, or maybe allow it
          
          if (key === 'engine') {
            const options = getEngineOptions(data.type);
            if (options.length > 0) {
              return (
                <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Engine</label>
                  <select 
                    value={value as string}
                    onChange={(e) => handleChange(key, e.target.value)}
                    style={inputStyles}
                  >
                    {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
              );
            }
          }

          if (key === 'readWriteRatio') {
            return (
              <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Read/Write Ratio</label>
                <select 
                  value={value as string}
                  onChange={(e) => handleChange(key, e.target.value)}
                  style={inputStyles}
                >
                  {['50/50', '70/30', '80/20', '90/10'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            );
          }

          if (key === 'layer') {
            return (
              <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>LB Layer</label>
                <select value={value as string} onChange={(e) => handleChange(key, e.target.value)} style={inputStyles}>
                  {['L4 (Transport)', 'L7 (Application)'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            );
          }

          if (key === 'algorithm') {
            return (
              <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Algorithm</label>
                <select value={value as string} onChange={(e) => handleChange(key, e.target.value)} style={inputStyles}>
                  {['Round Robin', 'Least Connections'].map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            );
          }
          
          return (
            <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              
              {typeof value === 'number' ? (
                <input 
                  type="number" 
                  value={value}
                  onChange={(e) => handleChange(key, Number(e.target.value))}
                  style={inputStyles}
                />
              ) : (
                <input 
                  type="text" 
                  value={value as string}
                  onChange={(e) => handleChange(key, e.target.value)}
                  style={inputStyles}
                />
              )}
            </div>
          );
        })}
      </div>
      
      <div style={{ padding: '16px', borderTop: '1px solid var(--border-color)' }}>
        <button
          onClick={() => deleteNode(id)}
          style={{
            width: '100%', background: 'transparent', color: 'var(--status-critical)',
            border: '1px solid var(--status-critical)', padding: '8px', borderRadius: '4px', cursor: 'pointer',
            fontWeight: 600, fontSize: '13px'
          }}
        >
          Delete Component
        </button>
      </div>
    </aside>
  );
}
