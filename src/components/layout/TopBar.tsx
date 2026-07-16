import React, { useState, useRef } from 'react';
import { Activity, Play, Download, Upload, Trophy } from 'lucide-react';
import { useCanvasStore } from '../../stores/canvas-store';
import { exportToJson, exportToC4 } from '../../utils/exporter';

export function TopBar({ onOpenScenarios }: { onOpenScenarios?: () => void }) {
  const { nodes, edges, updateNodeData, setNodes, setEdges, simulate } = useCanvasStore();
  const [globalRps, setGlobalRps] = useState(1000);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rps = Number(e.target.value);
    setGlobalRps(rps);
    
    // Update all client nodes
    nodes.forEach(node => {
      if (node.data.type === 'client') {
        updateNodeData(node.id, {
          properties: {
            ...node.data.properties,
            requestsPerSecond: rps
          }
        });
      }
    });
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const data = JSON.parse(content);
        
        if (data.nodes && data.edges) {
          setNodes(data.nodes);
          setEdges(data.edges);
          // Wait a tick for react flow to mount before simulating
          setTimeout(() => simulate(), 50);
        } else {
          alert('Invalid architecture file format.');
        }
      } catch (err) {
        console.error('Failed to parse JSON', err);
        alert('Invalid JSON file.');
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input
  };

  return (
    <header style={{ height: '60px', background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', padding: '0 24px', justifyContent: 'space-between' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Activity size={24} color="var(--accent-primary)" />
        <h1 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-primary)' }}>System Design Playground</h1>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 1, minWidth: 0 }}>
        {onOpenScenarios && (
          <button 
            onClick={onOpenScenarios}
            style={{
              background: 'var(--bg-tertiary)', border: '1px solid var(--accent-primary)',
              color: 'var(--accent-primary)', padding: '6px 12px', borderRadius: '8px',
              display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer',
              fontWeight: 600, fontSize: '12px', flexShrink: 0
            }}
          >
            <Trophy size={14} />
            <span className="sm-show">Scenarios</span>
          </button>
        )}
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'var(--bg-tertiary)', padding: '6px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', flexShrink: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <Play size={16} color="var(--status-healthy)" />
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Traffic:</span>
          </div>
          <input 
            type="range" 
            min="100" 
            max="100000" 
            step="100"
            value={globalRps}
            onChange={handleSliderChange}
            style={{ flex: 1, minWidth: '60px', maxWidth: '200px', accentColor: 'var(--accent-primary)' }}
          />
          <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', minWidth: '75px', textAlign: 'right', flexShrink: 0 }}>
            {globalRps.toLocaleString()} r/s
          </span>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <input 
            type="file" 
            accept=".json" 
            ref={fileInputRef} 
            onChange={handleImport} 
            style={{ display: 'none' }} 
          />
          <button 
            onClick={() => fileInputRef.current?.click()} 
            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '6px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', whiteSpace: 'nowrap' }}
            title="Import JSON Architecture"
          >
            <Upload size={14} /> Import
          </button>
          
          <button 
            onClick={() => exportToJson(nodes, edges)} 
            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '6px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', whiteSpace: 'nowrap' }}
          >
            <Download size={14} /> JSON
          </button>
          <button 
            onClick={() => exportToC4(nodes, edges)} 
            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '6px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', whiteSpace: 'nowrap' }}
          >
            <Download size={14} /> C4
          </button>
        </div>
      </div>
    </header>
  );
}
