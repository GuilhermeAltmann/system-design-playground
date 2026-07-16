import type { AppNode, AppEdge } from '../stores/canvas-store';

export function exportToJson(nodes: AppNode[], edges: AppEdge[]) {
  // Strip out React Flow internals and metrics for a cleaner export
  const cleanNodes = nodes.map(n => ({
    id: n.id,
    position: n.position,
    data: {
      label: n.data.label,
      type: n.data.type,
      properties: n.data.properties
    }
  }));

  const cleanEdges = edges.map(e => ({
    id: e.id,
    source: e.source,
    target: e.target
  }));

  const dataStr = JSON.stringify({ nodes: cleanNodes, edges: cleanEdges }, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  const exportFileDefaultName = 'architecture.json';
  triggerDownload(dataUri, exportFileDefaultName);
}

export function exportToC4(nodes: AppNode[], edges: AppEdge[]) {
  let c4 = 'C4Container\n';
  c4 += 'title System Architecture\n\n';
  
  nodes.forEach(n => {
    // Sanitize ID for Mermaid syntax
    const id = n.id.replace(/[^a-zA-Z0-9]/g, '_');
    const label = n.data.label;
    const desc = n.data.properties.engine || n.data.properties.provider || n.data.type;
    
    switch (n.data.type) {
      case 'client':
        c4 += `Person(${id}, "${label}", "${desc}")\n`;
        break;
      case 'database':
      case 'cache':
      case 'storage':
        c4 += `ContainerDb(${id}, "${label}", "${desc}", "")\n`;
        break;
      case 'queue':
        c4 += `ContainerQueue(${id}, "${label}", "${desc}", "")\n`;
        break;
      default:
        c4 += `Container(${id}, "${label}", "${desc}", "")\n`;
        break;
    }
  });

  c4 += '\n';
  
  edges.forEach(e => {
    const src = e.source.replace(/[^a-zA-Z0-9]/g, '_');
    const tgt = e.target.replace(/[^a-zA-Z0-9]/g, '_');
    c4 += `Rel(${src}, ${tgt}, "Uses", "HTTPS/TCP")\n`;
  });

  const dataUri = 'data:text/plain;charset=utf-8,'+ encodeURIComponent(c4);
  triggerDownload(dataUri, 'architecture-c4.mmd');
}

function triggerDownload(dataUri: string, filename: string) {
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', filename);
  document.body.appendChild(linkElement);
  linkElement.click();
  document.body.removeChild(linkElement);
}
